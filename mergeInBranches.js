const git = require('simple-git')()

const branches = require('./branches.json');
const mainBranch = "master";

const run = async () => {

    try {
        for (let i = 0; i < branches.length; i++) {
            const branch = branches[i];
            const checkoutResult =  await git.checkout(branch);
            console.log(checkoutResult);
            const mergeSummary = await git.mergeFromTo(mainBranch, branch, {
                '--no-ff': true,
            })
            console.log(mergeSummary);
            const commitSummary = await git.commit("auto merge")
            console.log(commitSummary);

            const pushSummary = await git.push()
            console.log(pushSummary);
        }

        const checkoutResult =  await git.checkout(mainBranch);
        console.log("back to main");
    }
    catch (err) {
        console.log(err)
    }
    finally {
        await git.checkout(mainBranch);
    }
}
run()

