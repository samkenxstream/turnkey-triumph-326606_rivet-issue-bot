/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 * 

/******************************************************************************
 * Replaces '@user' in a comment message with an @mention of the given user.
 ******************************************************************************/

function mention(commentText, user) {
  return commentText.replace("{{user}}", user)
}

/******************************************************************************
 * Posts a comment with the given message to the issue thread referenced 
 * in the given Probot execution context. Wraps the Probot framework's
 * GitHub API abstraction.
 ******************************************************************************/

function postIssueComment(context, message) {
  const comment = context.issue({ body: message })

  context.github.issues.createComment(comment)
}

/******************************************************************************
 * Closes the issue referenced in the given Probot execution context. Wraps
 * the Probot framework's GitHub API abstraction.
 *****************************************************************************/

function closeIssue(context) {
  context.github.issues.edit({
    owner: context.payload.repository.owner.login,
    repo: context.payload.repository.name,
    number: context.payload.issue.number,
    state: 'closed'
  })
}

/******************************************************************************
 * Export common functions.
 *****************************************************************************/

module.exports = {
  mention,
  postIssueComment,
  closeIssue
}