/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Return a list of open issues that have not had any activity in 30 days 
 * or more.
 */

/******************************************************************************
 * Fetches via Probot's GitHub API wrapper all issues that have not had any
 * activity in 30 days or more.
 ******************************************************************************/

function fetchStaleIssues(context) {
  const repo = context.payload.repository.full_name
  const timestamp = getDatestamp30DaysAgo()
  const query = `repo:${repo} is:issue is:open updated:<${timestamp}`
  
  return context.github.search.issues({
    q: query,
    sort: 'updated',
    order: 'desc',
    per_page: 30
  })
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
 * Returns each stale issue in the repo referenced in the given Probot
 * execution context. Issues are returned as a plain JavaScript object that
 * contains the issue title and URL.
 ******************************************************************************/

module.exports = async context => {
  const staleIssues = await fetchStaleIssues(context)

  return staleIssues.items.map(issue => ({
    title: issue.title,
    url: issue.url
  }))
}