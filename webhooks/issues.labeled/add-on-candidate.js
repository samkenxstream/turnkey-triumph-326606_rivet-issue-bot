/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Let the issue opener know that we don't think their feature request is a 
 * good fit for Rivet core. However, invite them to create a Rivet add-on that
 * meets their specific use case and we'd be happy to post it to the collection.
 * 
 * https://github.com/indiana-university/rivet-source/wiki/Issue-tracking
 */

const { mention, postIssueComment, closeIssue } = require('../common')

module.exports = async (context, dialogue) => {
  const message = mention(dialogue, context.payload.issue.user.login)
  
  await postIssueComment(context, message)
  await closeIssue(context)
}