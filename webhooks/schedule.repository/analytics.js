/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Sends a report containing some useful metrics related to issues.
 */

const { getPastDatestamp } = require('../common')

function getQuarterDateCutoffs() {
  const today     = new Date()
  const thisYear  = today.getFullYear()
  const lastYear  = thisYear - 1
  const nowMs     = today.getTime()
  const q1        = new Date(process.env.Q1_END + '-' + thisYear)
  const q2        = new Date(process.env.Q2_END + '-' + thisYear)
  const q3        = new Date(process.env.Q3_END + '-' + thisYear)
  const q4        = new Date(process.env.Q4_END + '-' + thisYear)
  const q1Ms      = q1.getTime()
  const q2Ms      = q2.getTime()
  const q3Ms      = q3.getTime()
  const q4Ms      = q4.getTime()

  const quarters = {
    q1LastYear: {
      label: `Q1 ${lastYear}`,
      start: process.env.Q1_START + '-' + lastYear,
      end: process.env.Q1_END + '-' + lastYear
    },
    q2LastYear: {
      label: `Q2 ${lastYear}`,
      start: process.env.Q2_START + '-' + lastYear,
      end: process.env.Q2_END + '-' + lastYear
    },
    q3LastYear: {
      label: `Q3 ${lastYear}`,
      start: process.env.Q3_START + '-' + lastYear,
      end: process.env.Q3_END + '-' + lastYear
    },
    q4LastYear: {
      label: `Q4 ${lastYear}`,
      start: process.env.Q4_START + '-' + lastYear,
      end: process.env.Q4_END + '-' + lastYear
    },
    q1ThisYear: {
      label: `Q1 ${thisYear}`,
      start: process.env.Q1_START + '-' + thisYear,
      end: process.env.Q1_END + '-' + thisYear
    },
    q2ThisYear: {
      label: `Q2 ${thisYear}`,
      start: process.env.Q2_START + '-' + thisYear,
      end: process.env.Q2_END + '-' + thisYear
    },
    q3ThisYear: {
      label: `Q3 ${thisYear}`,
      start: process.env.Q3_START + '-' + thisYear,
      end: process.env.Q3_END + '-' + thisYear
    },
    q4ThisYear: {
      label: `Q4 ${thisYear}`,
      start: process.env.Q4_START + '-' + thisYear,
      end: process.env.Q4_END + '-' + thisYear
    }
  }

  if (nowMs <= q1Ms) {
    return [
      quarters.q1LastYear,
      quarters.q2LastYear,
      quarters.q3LastYear,
      quarters.q4LastYear,
    ]
  } else if (nowMs <= q2Ms) {
    return [
      quarters.q2LastYear,
      quarters.q3LastYear,
      quarters.q4LastYear,
      quarters.q1ThisYear,
    ]
  } else if (nowMs <= q3Ms) {
    return [
      quarters.q3LastYear,
      quarters.q4LastYear,
      quarters.q1ThisYear,
      quarters.q2ThisYear,
    ]
  } else {
    return [
      quarters.q4LastYear,
      quarters.q1ThisYear,
      quarters.q2ThisYear,
      quarters.q3ThisYear,
    ]
  }
}

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