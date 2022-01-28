const core = require('@actions/core');
const axios = require('axios');
const constants = require('./constants');

const ENDPOINRT = "https://jpcssblogdev.azurewebsites.net/api";
const TOKEN_ENDPOINT = `${ENDPOINRT}/auth/token`


async function run() {

  try {
    const token = core.getInput("token");
    const githubId = core.getInput("githubId");
    const headers = {
      Authorization: `Bearer ${token}`
    };

    const res = await axios.get(constants.TOKEN_ENDPOINT, {
      headers: Object.assign(headers, constants.GITHUB_TRACES),
      maxRedirects: 0,
      validateStatus: function (status) {
        return status < 500;
      }
    });

    console.log(res);

    const result = res.data.alias;

    if(result) {
      if (alloExternalUser !== 'allow' && result.includes('-')){
        console.log(`${githubId} is not FTE.`);
        core.setOutput("isLinked", false);
      }
      console.log(`${githubId} is Microsoft linked account.`)
      core.setOutput("isLinked", true);
    } else {
      console.log(`${githubId} is not Microsoft linked account.`);
      core.setOutput("isLinked", false);
    }
  } catch (error) {
    console.log(error.message)
    core.setFailed(error.message);
  }
}

run();
