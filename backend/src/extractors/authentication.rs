use std::future::{Ready, ready};

use actix_web::{FromRequest, Error as ActixWebError, http::{self, header::HeaderValue}, error::ErrorUnauthorized, web};
use jsonwebtoken::TokenData;
use serde::{Serialize, Deserialize};

use crate::{models::user::User, controllers::jwt::{JWT, Claims}};

#[derive(Serialize, Deserialize)]
pub struct AuthenticationToken {
    pub user: User,
}

impl FromRequest for AuthenticationToken {
    type Error = ActixWebError;
    type Future = Ready<Result<Self, Self::Error>>;

    fn from_request(req: &actix_web::HttpRequest, _payload: &mut actix_web::dev::Payload) -> Self::Future {
        
        let auth_header: Option<&HeaderValue> = req.headers().get(http::header::AUTHORIZATION);
        match auth_header {
            None => ready(Err(ErrorUnauthorized(r#"{"code": 401, "message": "Invalid Authorization Token"}"#))),
            Some(token) => {
                let auth_token: String = token.to_str().unwrap_or("").to_string();

                if auth_token.is_empty() {
                    return ready(Err(ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized"}"#)));
                }

                let secret = req.app_data::<web::Data<String>>().unwrap();
                let decoded: Result<TokenData<Claims>, jsonwebtoken::errors::Error> = JWT::decode_jwt(&auth_token, secret);

                match decoded {
                    Err(_err) => ready(Err(ErrorUnauthorized(r#"{"code": 401, "message": "Unauthorized"}"#))),
                    Ok(token_data) => ready(Ok(AuthenticationToken {user: token_data.claims.user}))
                }
            }
        }
    }
}