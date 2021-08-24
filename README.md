# Tenant API Node Example

## Installation
`npm install`

## Configuration
Rename `conf.js.example` to `conf.js` and fill out the details

## Users and Plans
```
# Check the config looks OK
npm run validate

# Create an account
npm run account

# Invite (create) a user
npm run user

# Create a zone
npm run zone

# Add a subscription/plan to the zone (Biz/Pro etc.)
npm run plan
```

To avoid placing your API_KEY in the config file, you can also set it as an environment variable.

## Secure Web Gateway
```
dig sportsbet.com +short
dig sportsbet.com @172.64.36.1 +short # Expect regular result
# npm run create-account (already done)
npm run ip #Get the source IP if we are using IPv4 DNS Servers
npm run create-location # Can be single. Client may need to keep up-to-date.
npm run create-rule 
dig sportsbet.com @172.64.36.1 +short # Expect 0.0.0.0 
dig paddypower.com @172.64.36.1 +short # Expect 0.0.0.0 
#TODOs block pages etc.
```


## Not official advice

The purpose of this code is to help you get started. Consult your account team or [official documentation](https://developers.cloudflare.com/tenant/)
