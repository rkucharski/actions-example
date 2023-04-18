const github = require('@actions/github');
const core = require('@actions/core');

const { createLatestVersion, updatePatchVersion, getVersion } = require('./versions');

const coreVersionVariableName = 'CORE_VERSION';
const patchVersionVariableName = 'PATCH_VERSION';

async function run() {
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    //const myToken = core.getInput('myToken');

    const myToken = core.getInput('myToken');
    const octokit = github.getOctokit(myToken)

    const coreVersion = await getVersion(octokit, coreVersionVariableName);
    const patchVersion = await getVersion(octokit, patchVersionVariableName);    
    const { tag, newPatchVersion } = await createLatestVersion(coreVersion, patchVersion)
    await updatePatchVersion(octokit, newPatchVersion, patchVersionVariableName);
    
    await octokit.rest.repos.createRelease({
        owner: 'rkucharski',
        repo: 'actions-example',
        tag_name: `${tag}`,
        name: `${tag}`,
        body: `Release of version ${tag}`,
        draft: false,
        prerelease: false    
    });

    const { data } = await octokit.rest.repos.listTags({
        owner: 'rkucharski',
        repo: 'actions-example',
    });
    console.log(data);
}
  
run()