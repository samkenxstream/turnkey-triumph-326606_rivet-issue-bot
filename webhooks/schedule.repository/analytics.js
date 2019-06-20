/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Sends a report containing some useful metrics related to issues.
 */

const { getPastDatestamp } = require('../common')

/******************************************************************************
 * Fetches a count of all issues ever opened.
 ******************************************************************************/

async function fetchTotalLifetimeIssues(context) {
  const repo = context.payload.repository.full_name
  const query = `repo:${repo} is:issue`
  const issues = await context.github.search.issues({
    q: query
  })

  return issues.data.total_count
}

/******************************************************************************
 * Fetches the average time it's taken to close bug reports.
 ******************************************************************************/

async function fetchAverageTimeToCloseBugReport(context) {
  const repo = context.payload.repository.full_name
  const query = `repo:${repo} is:issue is:closed label:"bug :bug:"`
  const issues = await context.github.search.issues({
    q: query,
    sort: 'updated',
    order: 'desc',
    per_page: 1000 // maximum allowed by GitHub API
  })

  const daysToClose = issues.data.items.map((issue) => {
    return calculateIssueLifetime(issue)
  })

  const totalDaysToClose = daysToClose.reduce((total, days) => total + days, 0)

  return Math.ceil(totalDaysToClose / daysToClose.length)
}

/******************************************************************************
 * Fetches the average time it's taken to close feature requests.
 ******************************************************************************/

async function fetchAverageTimeToCloseFeatureRequest(context) {
  const repo = context.payload.repository.full_name
  const query = `repo:${repo} is:issue is:closed label:"request"`
  const issues = await context.github.search.issues({
    q: query,
    sort: 'updated',
    order: 'desc',
    per_page: 1000 // maximum allowed by GitHub API
  })

  const daysToClose = issues.data.items.map((issue) => {
    return calculateIssueLifetime(issue)
  })

  const totalDaysToClose = daysToClose.reduce((total, days) => total + days, 0)

  return Math.ceil(totalDaysToClose / daysToClose.length)
}

/******************************************************************************
 * Calculate the lifetime of a closed issue in days. This function is
 * pessimistic and rounds the time it takes to close an issue up to the
 * nearest whole day.
 ******************************************************************************/

function calculateIssueLifetime(issue) {
  const dayMs = 1000 * 60 * 60 * 24
  const openDate = new Date(issue.created_at)
  const closedDate = new Date(issue.closed_at)
  const diffMs = closedDate.getTime() - openDate.getTime()
  const diffDays = Math.ceil(diffMs / dayMs)

  return diffDays
}

module.exports = async context => {
  const totalIssues = await fetchTotalLifetimeIssues(context)
  const averageTimeToCloseBugReport = await fetchAverageTimeToCloseBugReport(context)
  const averageTimeToCloseFeatureRequest = await fetchAverageTimeToCloseFeatureRequest(context)
  
  return {
    totalIssues: totalIssues,
    averageTimeToCloseBugReport: averageTimeToCloseBugReport,
    averageTimeToCloseFeatureRequest: averageTimeToCloseFeatureRequest
  }
}