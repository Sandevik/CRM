mod users;
mod auth;
use actix_web::web::ServiceConfig;
use serde::{Serialize, Deserialize};
use users::users;
use auth::auth;

#[derive(Serialize, Deserialize)]
pub struct ErrorResponse {
    code: u16,
    message: String
}

impl ErrorResponse {
    pub fn not_found(thing: &str) -> Self {
        ErrorResponse {code: 404, message: format!("ERROR: {thing} was not found")}
    }
    pub fn internal_server_error(err: &str) -> Self {
        ErrorResponse {code: 500, message: format!("INTERNAL SERVER ERROR: {err}")}
    }
}

pub fn routes(conf: &mut ServiceConfig) {
    conf.service(auth());
    conf.service(users());
}