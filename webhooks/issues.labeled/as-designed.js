/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Let the issue opener know that their reported bug is in fact Rivet working 
 * as designed, so we're closing the issue.
 * 
 * https://github.com/indiana-university/rivet-source/wiki/Issue-tracking
 */

const { mention, postIssueComment, closeIssue } = require('../common')

module.exports = async (context, dialogue) => {
  const message = mention(dialogue, context.payload.issue.user.login)

  await postIssueComment(context, message)
  await closeIssue(context)
}