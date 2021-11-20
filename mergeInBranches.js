const git = require('simple-git')()

const run = async () => {
    
}

run()

git.checkout("brunchClub")
.then(() => {
git.mergeFromTo("master", "brunchClub", {
    '--no-ff': true,
})
    .then(mergeSummary => {
        console.log(mergeSummary)
        git.commit("aut merge")
            .then(commitSummary => {
                console.log(commitSummary)
                git.push()
                    .then(pushtSummary => {
                        console.log(pushtSummary)
                    })
            })
    })
})


