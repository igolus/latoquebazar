const git = require('simple-git')()

const branches = require('./branches.json');
const mainBranch = "";

const run = async () => {

    for (let i = 0; i < branches.length; i++) {
        const branch = branches[i];
        await git.checkout(branch);
        const mergeSummary = await git.mergeFromTo(mainBranch, branch, {
            '--no-ff': true,
        })
        console.log(mergeSummary);
        const commitSummary = await git.commit("auto merge")
        console.log(commitSummary);

        const pushSummary = await git.push()
        console.log(pushSummary);
    }
    await git.checkout(mainBranch);
}

run()

// git.checkout("brunchClub")
//     .then(() => {
//         git.mergeFromTo("master", "brunchClub", {
//             '--no-ff': true,
//         })
//             .then(mergeSummary => {
//                 console.log(mergeSummary)
//                 git.commit("aut merge")
//                     .then(commitSummary => {
//                         console.log(commitSummary)
//                         git.push()
//                             .then(pushtSummary => {
//                                 console.log(pushtSummary)
//                             })
//                     })
//             })
//     })


