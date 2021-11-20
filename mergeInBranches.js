const git = require('simple-git')()

git.checkout("brunchClub")
.then(() => {
    git.mergeFromTo("master", "brunchClub", {
        '--no-ff': true,
    })
    .then(mergeSummary => {
        //git.checkout()
        console.log(mergeSummary)
    })
})


