# Tenant API Node Example

## Installation
`npm install`

## Configuration
Rename `conf.js.example` to `conf.js` and fill out the details

## Run
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

## Not official advice

The purpose of this code is to help you get started. Consult your account team or [official documentation](https://developers.cloudflare.com/tenant/)
