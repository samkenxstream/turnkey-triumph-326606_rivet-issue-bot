/** 
 * Copyright (C) 2019 The Trustees of Indiana University
 * SPDX-License-Identifier: BSD-3-Clause
 */

const yaml = require('read-yaml')
const dialogue = yaml.sync('dialogue.yml')
const createScheduler = require('probot-scheduler')
const sendmail = require('sendmail')();
const postThankYouComment = require('./webhooks/issues.opened/thanks')
const postThanksButNeedMoreInfoComment = require('./webhooks/issues.opened/empty-body')
const postAddOnCandidateCommentAndClose = require('./webhooks/issues.labeled/add-on-candidate')
const postAsDesignedCommentAndClose = require('./webhooks/issues.labeled/as-designed')
const postVerifiedBugComment = require('./webhooks/issues.labeled/bug')
const postDiscussionComment = require('./webhooks/issues.labeled/discussion')
const postDuplicateCommentAndClose = require('./webhooks/issues.labeled/duplicate')
const postHaventForgottenComment = require('./webhooks/issues.labeled/havent-forgotten')
const postNotEnoughInfoCommentAndClose = require('./webhooks/issues.labeled/not-enough-info')
const postNotReproducibleCommentAndClose = require('./webhooks/issues.labeled/not-reproducible')
const postOutOfScopeCommentAndClose = require('./webhooks/issues.labeled/out-of-scope')
const postNoQuestionsCommentAndClose = require('./webhooks/issues.labeled/question')
const postAcceptedFeatureRequestComment = require('./webhooks/issues.labeled/request')
const fetchStaleIssues = require('./webhooks/schedule.repository/stale')

module.exports = app => {

  /***************************************************************************
   * Bot reactions to a new issue being created.
   **************************************************************************/

  app.on('issues.opened', async context => {
    const issueBody = context.payload.issue.body
    const issueBodylengthThreshold = 140
    
    if (issueBody.length >= issueBodylengthThreshold) {
      postThankYouComment(context, dialogue.thanks)
    } else {
      postThanksButNeedMoreInfoComment(context, dialogue.emptyBody)
    }
  })

  /***************************************************************************
   * Bot reactions to labels being added to an issue.
   **************************************************************************/

  app.on('issues.labeled', async context => {
    const label = context.payload.label.name

    switch (label) {
      case 'add-on candidate':
        postAddOnCandidateCommentAndClose(context, dialogue.addOnCandidate)
        break
      case 'as designed':
        postAsDesignedCommentAndClose(context, dialogue.asDesigned)
        break
      case 'bug :bug:':
        postVerifiedBugComment(context, dialogue.bug)
        break
      case 'discussion :question:':
        postDiscussionComment(context, dialogue.discussion)
        break
      case 'duplicate':
        postDuplicateCommentAndClose(context, dialogue.duplicate)
        break
      case 'havent forgotten':
        postHaventForgottenComment(context, dialogue.haventForgotten)
        break
      case 'not enough info':
        postNotEnoughInfoCommentAndClose(context, dialogue.notEnoughInfo)
        break
      case 'not reproducible':
        postNotReproducibleCommentAndClose(context, dialogue.notReproducible)
        break
      case 'out of scope':
        postOutOfScopeCommentAndClose(context, dialogue.outOfScope)
        break
      case 'question':
        postNoQuestionsCommentAndClose(context, dialogue.question)
        break
      case 'request':
        postAcceptedFeatureRequestComment(context, dialogue.request)
        break
      default:
        break
    }
  })

  /***************************************************************************
   * Scheduled bot tasks that run every week.
   **************************************************************************/

   createScheduler(app, {
     interval: 7 * 24 * 60 * 60 * 1000
   })

   app.on('schedule.repository', async context => {
    const staleIssues = await fetchStaleIssues(context)
    
    console.log(staleIssues)
   })
}
