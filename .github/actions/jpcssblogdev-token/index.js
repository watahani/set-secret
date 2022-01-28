const core = require('@actions/core');
const axios = require('axios');

const ENDPOINRT = "https://jpcssblogdev.azurewebsites.net/api";
const TOKEN_ENDPOINT = `${ENDPOINRT}/auth/token`

async function run() {

  try {
    const ACTIONS_ID_TOKEN_REQUEST_URL = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
    const ACTIONS_ID_TOKEN_REQUEST_TOKEN = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    const AUDIENCE = "api://jpcssblogdev.azurewebsites.net"
    
    const githubTokenRes = await axios.get(ACTIONS_ID_TOKEN_REQUEST_URL, {
      params: {
        audience: AUDIENCE
      },
      headers: {
        Authorization: `Bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}`
      }
    })


    console.log(githubTokenRes);

    const githubToken = githubTokenRes.data.value;

    const headers = {
      Authorization: `Bearer ${githubToken}`
    }

    const tokenResult = await axios.get(TOKEN_ENDPOINT, {
      headers: headers
    })

    const token = tokenResult.data.value;

    core.setOutput("token", token);

  } catch (error) {
    console.log(error)
    core.setFailed(error.message);
  }
}

run();
