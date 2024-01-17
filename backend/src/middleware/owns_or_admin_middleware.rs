use actix_web::{dev::ServiceRequest, web::{Data, self}, error::ErrorUnauthorized, HttpMessage};
use actix_web_httpauth::extractors::{bearer::{BearerAuth, self}, AuthenticationError};
use jsonwebtoken::TokenData;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::{controllers::jwt::{Claims, JWT}, models::{user::User, crm::CRM}, AppState};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct RequiresUuid {
    pub uuid: String,
}

// You can get the uuid either via json (body) or via the query params

pub async fn validator(mut req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, (actix_web::Error, ServiceRequest)> {
    let jwt_secret: Data<String> = Data::new(std::env::var("BACKEND_JWT_SECRET").expect("BACKEND_JWT_SECRET must be set"));
    let token_string: String = credentials.token().to_string();
    let json: Result<web::Json<RequiresUuid>, actix_web::Error> = req.extract::<web::Json<RequiresUuid>>().await;
    let query_string: Result<web::Query<RequiresUuid>, actix_web::Error> = req.extract::<web::Query<RequiresUuid>>().await;
    
    let uuid: Uuid;
    if query_string.is_ok() && Uuid::parse_str(query_string.as_ref().unwrap().uuid.as_str()).is_ok() || json.is_ok() && Uuid::parse_str(json.as_ref().unwrap().uuid.as_str()).is_ok() {
        if query_string.is_ok() {
            uuid = Uuid::parse_str(query_string.as_ref().unwrap().uuid.as_str()).unwrap();
        } else {
            uuid = Uuid::parse_str(json.as_ref().unwrap().uuid.as_str()).unwrap();
        }
    } else {
        return Err((ErrorUnauthorized(r#"{"code": 400, "Bad request, neither uuid found in query params or body. Can't verify ownership."}"#), req));
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
                            if user.current_jwt == token_string {
                                if user.admin || CRM::user_owns(&user, &uuid, data).await.unwrap() {
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