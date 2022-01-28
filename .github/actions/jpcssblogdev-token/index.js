const core = require('@actions/core');
const axios = require('axios');

const ENDPOINRT = "https://jpcssblogdev.azurewebsites.net/api";
const TOKEN_ENDPOINT = `${ENDPOINRT}/auth/token`

async function run() {

  try {
    const ACTIONS_ID_TOKEN_REQUEST_URL = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
    const ACTIONS_ID_TOKEN_REQUEST_TOKEN = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;

    const GITHUB_WORKFLOW = process.env.GITHUB_WORKFLOW;
    const GITHUB_SHA = process.env.GITHUB_SHA;
    const GITHUB_RUN_NUMBER = process.env.GITHUB_RUN_NUMBER;
    const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;

    const GithubTraces = {
      GITHUB_WORKFLOW,
      GITHUB_SHA,
      GITHUB_RUN_NUMBER,
      GITHUB_REPOSITORY
    }

    const AUDIENCE = "api://jpcssblogdev.azurewebsites.net"

    if (!ACTIONS_ID_TOKEN_REQUEST_URL){
      throw new Exception("ACTIONS_ID_TOKEN_REQUEST_URL is null. Please make sure your action have id_token: write permissions.")
    }

    const githubTokenRes = await axios.get(ACTIONS_ID_TOKEN_REQUEST_URL, {
      params: {
        audience: AUDIENCE
      },
      headers: {
        Authorization: `Bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}`
      }
    })

    const githubToken = githubTokenRes.data.value;

    const headers = {
      Authorization: `Bearer ${githubToken}`
    }

    const tokenResult = await axios.get(TOKEN_ENDPOINT, {
      headers: Object.assign(headers, GithubTraces)
    })

    const token = tokenResult.data.value;

    core.setOutput("token", token);

  } catch (error) {
    console.log(error.message)
    core.setFailed(error.message);
  }
}

run();
