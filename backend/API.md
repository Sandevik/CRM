
# Routes

## /auth
###  /auth/sign-in        | POST | JSON: email (string), password (string)
###  /auth/sign-up        | POST | JSON: email (string), password (string), phone_number (string)
###  /auth/validate-token | POST | JSON: token (string)

##  /crm
###     /crm?uuid={insert-uuid-here} | GET,  Secured by ownership 
###     /crm?uuid={insert-uuid-here} | DELETE, Secured by ownership
###     /crm/all                     | GET, Secured by ownership




## /all-crms | GET
## /create-crm | POST | JSON: name (string)


## /clients
###     /clients?uuid={crm_uuid}&clientUuid={client_uuid} | GET, Secured by ownership


## /test
###  /test/generate-hash | GET
















