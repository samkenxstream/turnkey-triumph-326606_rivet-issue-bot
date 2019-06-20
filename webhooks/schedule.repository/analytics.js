/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Sends a report containing some useful metrics related to issues.
 */

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

module.exports = async context => {
  const totalIssues = await fetchTotalLifetimeIssues(context)
  
  return {
    totalIssues: totalIssues
  }
}