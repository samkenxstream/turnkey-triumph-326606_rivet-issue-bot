/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 
 * Thank the person for filing an issue and let them know we'll be by shortly
 * to take a look. Direct them to the wiki in the meantime.
 */

const { mention, postIssueComment } = require('../common')

module.exports = async (context, dialogue) => {
  const message = mention(dialogue, context.payload.issue.user.login)

  await postIssueComment(context, message)
}