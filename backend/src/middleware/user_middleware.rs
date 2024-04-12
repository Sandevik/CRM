use actix_web::{dev::ServiceRequest, error::{ErrorBadRequest, ErrorUnauthorized}, web::{self, BytesMut, Data}, HttpMessage};
use actix_web_httpauth::extractors::{bearer::{BearerAuth, self}, AuthenticationError};
use jsonwebtoken::TokenData;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::{controllers::jwt::{Claims, JWT}, models::user::User, AppState};
use futures_util::StreamExt;



pub async fn validator(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (actix_web::Error, ServiceRequest)> {
    let jwt_secret: Data<String> = Data::new(std::env::var("BACKEND_JWT_SECRET").expect("BACKEND_JWT_SECRET must be set"));
    let token_string: String = credentials.token().to_string();

    if token_string == "".to_string() || token_string == "Bearer ".to_string() {
        return Err((ErrorUnauthorized(r#"{"code": 401, "Unauthorized, no token found"}"#), req));
    }

    let data: &Data<AppState> = req.app_data::<Data<AppState>>().expect("Appstate could not be found.");

    let claims: Result<TokenData<Claims>, jsonwebtoken::errors::Error> = JWT::decode_jwt(&token_string, &jwt_secret);
    match claims {
        Err(_) => {
            let config = req.app_data::<bearer::Config>().cloned().unwrap_or_default().scope("");
            Err((AuthenticationError::from(config).into(), req))
        },
        Ok(value) => {

            match User::get_by_uuid(&value.claims.user.uuid.hyphenated().to_string(), data).await {
                Err(_) => Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized"}"#), req)),
                Ok(user) => {
                    match user {
                        None => Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized"}"#), req)),
                        Some(user) => {
                            if user.current_jwt == Some(token_string) {
                                req.extensions_mut().insert(value.claims);
                                Ok(req)
                            } else {
                                Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized, your token has been updated"}"#), req))
                            }
                        }
                    }
                }
            }
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RequiresUserUuid {
    #[serde(rename(deserialize = "employeeUserUuid"))]
    pub employee_user_uuid: String,
}


// kolla så att uuid på personen man skickar in är samma som den i token
// This validator is used by the employee of a crm, to get its allowed crms from its employee_user_uuid 
pub async fn validator_user_self(mut req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (actix_web::Error, ServiceRequest)> {
    let mut body = BytesMut::new();
    let mut stream = req.take_payload();
    while let Some(chunk) = stream.next().await {
        body.extend_from_slice(&chunk.unwrap());
    }
    let body_clone = body.clone();
    let (_, mut payload) = actix_http::h1::Payload::create(true);
    payload.unread_data(body.into());
    req.set_payload(payload.into());

    let jwt_secret: Data<String> = Data::new(std::env::var("BACKEND_JWT_SECRET").expect("BACKEND_JWT_SECRET must be set"));
    let token_string: String = credentials.token().to_string();
    let json: Result<web::Json<RequiresUserUuid>, actix_web::Error> = req.extract::<web::Json<RequiresUserUuid>>().await;
    let query_string: Result<web::Query<RequiresUserUuid>, actix_web::Error> = req.extract::<web::Query<RequiresUserUuid>>().await;
    let uuid: Uuid;

    if query_string.is_ok() && Uuid::parse_str(&query_string.as_ref().unwrap().employee_user_uuid.as_str()).is_ok() || json.is_ok() && Uuid::parse_str(&json.as_ref().unwrap().employee_user_uuid.as_str()).is_ok() {
        if query_string.is_ok() {
            uuid = Uuid::parse_str(&query_string.as_ref().unwrap().employee_user_uuid.as_str()).unwrap();
        } else {
            uuid = Uuid::parse_str(&json.as_ref().unwrap().employee_user_uuid.as_str()).unwrap();
        }
    } else {
        return Err((ErrorBadRequest(r#"{"code": 400, "Bad request, employeeUserUuid found in query params or body. Can't verify ownership."}"#), req));
    }

    if token_string == "".to_string() || token_string == "Bearer ".to_string() {
        return Err((ErrorUnauthorized(r#"{"code": 401, "Unauthorized, no token found"}"#), req));
    }

   
    let data: &Data<AppState> = req.app_data::<Data<AppState>>().expect("Appstate could not be found.");
    let claims: Result<TokenData<Claims>, jsonwebtoken::errors::Error> = JWT::decode_jwt(&token_string, &jwt_secret);
    match claims {
        Err(_) => {
            let config = req.app_data::<bearer::Config>().cloned().unwrap_or_default().scope("");
            Err((AuthenticationError::from(config).into(), req))
        },
        Ok(value) => {

            match User::get_by_uuid(&value.claims.user.uuid.hyphenated().to_string(), data).await {
                Err(_) => Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized"}"#), req)),
                Ok(user) => {
                    match user {
                        None => Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized"}"#), req)),
                        Some(user) => {
                            if user.current_jwt == Some(token_string) {
                                if user.uuid.hyphenated().to_string() == uuid.hyphenated().to_string() {
                                    let (_, mut payload) = actix_http::h1::Payload::create(true);
                                    payload.unread_data(body_clone.into());
                                    req.set_payload(payload.into());

                                    req.extensions_mut().insert(value.claims);
                                    Ok(req)
                                } else {
                                    Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized, you are trying to access someone else's information"}"#), req))
                                } 

                            } else {
                                Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized, your token has been updated"}"#), req))
                            }
                        }
                    }
                }
            }
        }
    }
}