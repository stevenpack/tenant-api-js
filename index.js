let conf = require("./conf");

let axios = require('axios').default;
axios.defaults.baseURL = "https://api.cloudflare.com/client/v4";
axios.defaults.headers.common['X-Auth-Email'] = conf.API_EMAIL;
axios.defaults.headers.common['X-Auth-Key'] = process.env.API_KEY || conf.API_KEY;
axios.defaults.headers.post['Content-Type'] = "application/json"


async function validateConfig() {   

    if (!conf.API_KEY) {
        info("FAIL: API_KEY missing");
    }

    if (!conf.API_EMAIL) {
        info("FAIL: API_EMAIL missing");
    }

    if (!conf.ACCOUNT_ID) {
        info("FAIL: ACCOUNT_ID missing");
    } else {
        let res = await get(`/accounts/${conf.ACCOUNT_ID}/members`, false);
        if (res.data.result) {
            info("Config validated OK. Got some data back")
        }    
    }
}

async function createAccount() {
    let acct = { "name": "Tenant Account " + fauxRand(), "type": "standard" };
    await post("/accounts", acct)   
}

async function inviteUser() {
    //If there's an invite email in the config, use that. Otherwise, create a random
    let testEmail = conf.INVITE_EMAIL || `foo@bar${fauxRand()}.com`;
    //Admin
    let invite = { "email":testEmail, "roles": ["05784afa30c1afe1440e79d9351c7430"] };
    info(`Inviting user email ${testEmail}...`);
    await post(`/accounts/${conf.ACCOUNT_ID}/members`, invite);
}

async function createZone() {
    let zoneName = conf.ZONE_NAME || `example.org`;
    let zone = { "name": zoneName, "account": { "id": conf.ACCOUNT_ID }};
    info(`Creating zone ${zoneName}`);
    let res = await post("/zones", zone);
    if (res.data && res.data.result) {
        let nameServers = res.data.result.name_servers;
        if (nameServers) {
            info(`Point ${zoneName}'s nameservers to ${nameServers} to activate zone on Cloudflare`);
        }    
    }
}

async function createZoneSubscription() {
   let subscription = {"rate_plan": {"id": "PARTNERS_PRO"}};
   
   //Get zone id from name
   info(`Looking up zoneId for ${conf.ZONE_NAME}`);
   let res = await get(`/zones?name=${conf.ZONE_NAME}`);
   let zoneId = res.data.result[0].id;
    info(`Adding PARTNERS_PRO zone subscription to ${conf.ZONE_NAME} (${zoneId})`)
    await post(`/zones/${zoneId}/subscription`, subscription)
}

function fauxRand() {
    return new Date().getTime();
}

function dump(res) {
    debug(`Success: ${res.data.success}`);
    if (res.data && res.data.errors) {
        res.data.errors.map(e => debug(e))
    }    
    if (res.data && res.data.messages) {
        res.data.messages.map(e => debug(e))
    }
    if (res.data && res.data.result) {
        debug(res.data.result);
    }
}

async function go() {
    let cmd = process.argv[2] || "validate";
    info(`Executing command '${cmd}'...`);
    switch (cmd) {
        case "account":
            await createAccount();
            break;
        case "user":
            await inviteUser();
            break;
        case "zone":
            await createZone();
            break;
        case "plan":
            await createZoneSubscription()
            break;
        case "help":
        case "-h":
            console.log("Usage: node index [validate|account|user|zone|plan]")
        case "validate":
        default:
            await validateConfig();
            break;
    }
    info("done.");
}

async function get(url, verbose = true) {
    debug(`Getting ${url}...`);
    let res = await axios.get(url);
    if (verbose) {
        dump(res);
    }
    return res;
}

async function post(url, data, verbose = true) {
    debug(`Posting to ${url}`);
    try {
        let res = await axios.post(url, data);
        if (verbose) {
            dump(res);    
        }
        return res;
    } catch (e) {
        if (e.response) {
            //Show a concise version withe CF API errors
            dump(e.response);
            return e.response;
        }
        else {
            //Dump the whole thing if we got a protocol error rather
            //than an API error, to help with debugging
            debug(e);
        }
    }    
}

function debug(obj) {
    console.debug(`DEBUG: ${JSON.stringify(obj, null, 2)}`);
}

function info(obj) {
    console.log(`INFO: ${JSON.stringify(obj, null, 2)}`);
}

go()

