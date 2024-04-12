use actix_web::{dev::ServiceRequest, web::{Data, self, BytesMut}, error::{ErrorUnauthorized, ErrorBadRequest}, HttpMessage};
use actix_web_httpauth::extractors::{bearer::{BearerAuth, self}, AuthenticationError};
use futures_util::StreamExt;
use jsonwebtoken::TokenData;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::{controllers::jwt::{Claims, JWT}, models::{user::User, crm::CRM}, AppState};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RequiresUuid {
    #[serde(rename(deserialize = "crmUuid"))]
    pub crm_uuid: String,
}

// You can get the uuid either via json (body) or via the query params

pub async fn validator(mut req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (actix_web::Error, ServiceRequest)> {
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
    let json: Result<web::Json<RequiresUuid>, actix_web::Error> = req.extract::<web::Json<RequiresUuid>>().await;
    let query_string: Result<web::Query<RequiresUuid>, actix_web::Error> = req.extract::<web::Query<RequiresUuid>>().await;
    let uuid: Uuid;

    if query_string.is_ok() && Uuid::parse_str(&query_string.as_ref().unwrap().crm_uuid.as_str()).is_ok() || json.is_ok() && Uuid::parse_str(&json.as_ref().unwrap().crm_uuid.as_str()).is_ok() {
        if query_string.is_ok() {
            uuid = Uuid::parse_str(&query_string.as_ref().unwrap().crm_uuid.as_str()).unwrap();
        } else {
            uuid = Uuid::parse_str(&json.as_ref().unwrap().crm_uuid.as_str()).unwrap();
        }
    } else {
        return Err((ErrorBadRequest(r#"{"code": 400, "Bad request, neither crmUuid found in query params or body. Can't verify ownership."}"#), req));
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
                                if CRM::user_owns_or_is_admin(&user, &uuid, data).await.unwrap() || CRM::user_can_access_crm(&user, &uuid, data).await.expect("ERROR: Could not determine if user can access crm") || CRM::user_can_handle_customers(&user, &uuid, data).await.expect("ERROR: Could not determine if user can handle customers") || CRM::user_can_handle_employees(&user, &uuid, data).await.expect("ERROR: Could not determine if user can handle employees") || CRM::user_can_handle_vehicles(&user, &uuid, data).await.expect("ERROR: Could not determine if user can handle vehicles") {
                                    let (_, mut payload) = actix_http::h1::Payload::create(true);
                                    payload.unread_data(body_clone.into());
                                    req.set_payload(payload.into());

                                    req.extensions_mut().insert(value.claims);
                                    Ok(req)
                                } else {
                                    Err((ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized, you are not the owner of this crm."}"#), req))
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