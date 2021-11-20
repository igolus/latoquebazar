const git = require('simple-git')()

const branches = require('./branches.json');

branches.forEach(branchName =>
    git.checkout(branchName)
        .then(() => {
            git.mergeFromTo("master", branchName, {
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

)




