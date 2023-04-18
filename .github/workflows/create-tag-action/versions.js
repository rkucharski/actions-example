async function updatePatchVersion(octokit, patchVersion, patchVersionVariableName) {
    await octokit.request(`PATCH /repos/{owner}/{repo}/actions/variables/${patchVersionVariableName}`, {
        owner: 'rkucharski',
        repo: 'actions-example',
        value: `${patchVersion}`
    });
}

async function getVersion(octokit, variableName) {
    return await octokit.request(`GET /repos/{owner}/{repo}/actions/variables/${variableName}`, {
        owner: 'rkucharski',
        repo: 'actions-example',
    })
    .then(response => response.data.value)
    .then(version => version);
}

async function createLatestVersion(coreVersion, patchVersion) {
    const newPatchVersion = parseInt(patchVersion) + 1;
    const tag = `${coreVersion}.${newPatchVersion}`;
    return { tag, newPatchVersion };
}

module.exports = { updatePatchVersion, getVersion, createLatestVersion };