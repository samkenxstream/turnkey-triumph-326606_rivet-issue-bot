/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Sends a report of all open issues that have not had any activity in
 * 30 days or more.
 */

const sendgrid = require('@sendgrid/mail')

/******************************************************************************
 * Fetches via Probot's GitHub API wrapper all issues that have not had any
 * activity in 30 days or more.
 ******************************************************************************/

async function fetchStaleIssues(context) {
  const repo = context.payload.repository.full_name
  const timestamp = getDatestamp30DaysAgo()
  const query = `repo:${repo} is:issue is:open updated:<${timestamp}`
  const issues = await context.github.search.issues({
    q: query,
    sort: 'updated',
    order: 'desc',
    per_page: 30
  })

  return issues.data.items.map(issue => ({
    title: issue.title,
    url: issue.html_url
  }))
}

/******************************************************************************
 * Gets the date stamp from 30 days ago in YYYY-MM-DD format.
 ******************************************************************************/

function getDatestamp30DaysAgo() {
  const date = new Date()

  date.setDate(date.getDate() - 30)

  return date.toISOString().split('T')[0]
}

/******************************************************************************
 * Builds the plaintext stale issues report body from a list of stale issues.
 ******************************************************************************/

function buildPlaintextReportBody(issues) {
  return issues
          .map((issue) => issue.title + '\n' + issue.url)
          .join('\n\n')
}

/******************************************************************************
 * Builds the HTML stale issues report body from a list of stale issues.
 ******************************************************************************/

function buildHtmlReportBody(issues) {
  return issues
          .map((issue) => issue.title + '<br>' + issue.url)
          .join('<br><br>')
}

/******************************************************************************
 * Builds the stale issues report body to be sent via SendGrid.
 ******************************************************************************/

function buildStaleIssueReportBody(issues) {
  return {
    to: 'scanmurr@iu.edu',
    from: 'no-reply@iu.edu',
    subject: 'Rivet stale issues - weekly report',
    text: buildPlaintextReportBody(issues),
    html: buildHtmlReportBody(issues)
  }
}

/******************************************************************************
 * Sends a report to the Rivet group account email detailing all issues that
 * have not had any activity in more than 30 days.
 ******************************************************************************/

module.exports = async context => {
  const staleIssues = await fetchStaleIssues(context)

  if (staleIssues.length > 0) {
    const report = buildStaleIssueReportBody(staleIssues)
    
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
    sendgrid.send(report)
  }
}