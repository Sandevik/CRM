mod users;
mod auth;
mod test;

use actix_web::web::ServiceConfig;
use serde::{Serialize, Deserialize};

use users::users;
use auth::auth;
use test::test;

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
    pub fn bad_request(reason: &str) -> Self {
        ErrorResponse {code: 400, message: format!("ERROR: {reason}")}
    }
}

pub fn routes(conf: &mut ServiceConfig) {
    conf.service(auth());
    conf.service(users());
    conf.service(test());
}