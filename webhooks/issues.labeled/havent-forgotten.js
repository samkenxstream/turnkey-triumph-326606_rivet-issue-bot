/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Explain to the issue opener that we've been unable to prioritze their
 * request and likely won't be able to do so in the near future. However,
 * they are more than welcome to open a pull request.
 * 
 * https://github.com/indiana-university/rivet-source/wiki/Issue-tracking
 */

const { mention, postIssueComment } = require('../common')

module.exports = async (context, dialogue) => {
  const message = mention(dialogue, context.payload.issue.user.login)
  
  await postIssueComment(context, message)
}