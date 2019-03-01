# Rivet Issue Bot

A GitHub App built with [Probot](https://github.com/probot/probot) that automates issue replies for the Rivet software design system.

## Automated responses

The Rivet issue bot replies to the creation of new issues and the labeling of existing issues. The text of the bot's replies can be found in [dialogue.yml](https://github.com/indiana-university/rivet-issue-bot/blob/master/dialogue.yml).

### New issue created

The Rivet issue bot replies to each new issue that's created. If the issue body is less than the `issueBodylengthThreshold` defined in [index.js](https://github.com/indiana-university/rivet-issue-bot/blob/master/index.js), the bot will prompt the issue creator for more information.

### Label added to issue

The Rivet issue bot posts a comment each time an issue is tagged with one of the labels listed below. Each of the bot's comments explain why the issue was given a particular label, what the issue's opener can expect to happen next, and where on the [Rivet wiki](https://github.com/indiana-university/rivet-source/wiki) they can learn more.

If the label identifies [one of the issue types we automatically close](https://github.com/indiana-university/rivet-source/wiki/Issue-tracking#closing-issues), the bot will close the issue as well.

- `add-on candidate`
- `as designed`
- `bug`
- `discussion`
- `duplicate`
- `havent forgotten`
- `not enough info`
- `not reproducible`
- `out of scope`
- `question`
- `request`