Currently scratch notes about OAuth mode

Condition: environment variable set
  SLACK_OAUTH_MODE=true 

Additional setup necessary: 
  In Slack app config: setup redirect URL
  Setup Airtable table properly

Behavior
  - Airtable base and table should be set to a table with WS ID & Installation JSON fields

Caveats/known limitations
  - does not support org-wide installs
  - supports only one record per team