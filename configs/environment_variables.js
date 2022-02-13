// Load dependency to help validate environment variables
const envalid = require('envalid')

// Load environment variables from .env file, if it exists
require('dotenv').config()

// Define a custom validator that requires the value to begin with the specified prefix
const nonEmptyStringStartsWith = (x) => {
  return envalid.makeValidator((v) => {
    if (v === '') {
      throw new Error('Value must not be empty')
    }
    if (!v.startsWith(x)) {
      throw new Error(`Must start with ${x}`)
    }
    return v
  })()
}

// Define a custom validator that requires the value to be a non-empty string
const nonEmptyString = envalid.makeValidator((v) => {
  if (v === '') {
    throw new Error('Value must not be empty')
  }
  return v
})

// Determine if we should validate environment variables for Slack OAuth mode
//   which supports app installation across multiple workspaces
const isOAuthMode = process.env.SLACK_OAUTH_MODE === 'true'
console.log('Running in OAuth mode:', isOAuthMode)
// Define validation schema for environment variables
// For information about each variable, see the comments in .env.example
const EnvVars = envalid.cleanEnv(process.env, {
  SLACK_APP_TOKEN: nonEmptyStringStartsWith('xapp-'),

  // Single workspace (non-OAuth mode only):
  ...(!isOAuthMode && {
    SLACK_BOT_TOKEN: nonEmptyStringStartsWith('xoxb-')
  }),

  // Multi-workspace (OAuth mode only):
  ...(isOAuthMode && {
    SLACK_CLIENT_ID: nonEmptyString(),
    SLACK_CLIENT_SECRET: nonEmptyString(),
    SLACK_STATE_SECRET: nonEmptyString(),
    SLACK_SCOPES: nonEmptyString()
  }),

  AIRTABLE_API_KEY: nonEmptyStringStartsWith('key'),
  AIRTABLE_BASE_ID: nonEmptyStringStartsWith('app'),
  AIRTABLE_TABLE_ID: nonEmptyStringStartsWith('tbl'),
  AIRTABLE_PRIMARY_FIELD_NAME: nonEmptyString(),

  LOG_LEVEL: envalid.str({ default: 'info', choices: ['debug', 'info', 'warn', 'error'] })
})

// If we got this far, environment variables have been validated
console.log(`✅ Environment variables validated & loaded (for SLACK_OAUTH_MODE: ${isOAuthMode})`)

module.exports = {
  EnvVars
}
