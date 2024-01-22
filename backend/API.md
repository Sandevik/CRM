
# Routes

## /auth
###  /auth/sign-in        | POST | JSON: email (string), password (string)
###  /auth/sign-up        | POST | JSON: email (string), password (string), phone_number (string)
###  /auth/validate-token | POST | JSON: token (string)

##  /crm
###     /crm?crmUuid={insert-uuid-here} | GET,  Secured by ownership 
gets a crm with a specific uuid
###     /crm?crmUuid={insert-uuid-here} | DELETE, Secured by ownership
deletes a crm with a specific uuid
###     /crm/all                     | GET, Secured by ownership




## /all-crms | GET
returns all the logged in users crms
## /create-crm | POST | JSON: name (string)
creates a new crm

## /clients
###     /clients?crmUuid={crm_uuid}&clientUuid={client_uuid} | GET, Secured by ownership
gets a specific client with the client uuid

## /meetings
###     /meetings/this-month?uuid={crm_uuid} | GET, Secured by ownership
gets all meetings this month
###     /meetings?crmUuid={crm_uuid}&year={year}&month={month, 1-12} | GET, Secured by ownership, 
returns all meetings based on year and month in query
###     /meetings/create | POST | JSON: uuid (string)(crm_uuid), from (string), to (string), clientUuid (string), Secured by ownership
Creates a new meeting in a crm system with a specific client

## /test
###  /test/generate-hash | GET
















