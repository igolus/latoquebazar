const git = require('simple-git')()

git.mergeFromTo("master", "brunchClub", {
    '--no-ff': true,
})
.then(mergeSummary => {
    console.log(mergeSummary)
})