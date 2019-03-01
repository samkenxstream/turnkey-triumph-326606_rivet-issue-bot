/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Explain to the issue opener what it means when we tag a feature request
 * "discussion" and point them to our wiki on feature requests. Also give
 * the issue opener an idea of the kind of info we're looking for that can
 * help us decide whether to accept their feature request or not.
 * 
 * https://github.com/indiana-university/rivet-source/wiki/Issue-tracking
 */

const { mention, postIssueComment } = require('../common')

module.exports = async (context, dialogue) => {
  const message = mention(dialogue, context.payload.issue.user.login)
  
  await postIssueComment(context, message)
}