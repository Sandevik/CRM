mod users;
mod auth;
mod crm;
mod test;

use actix_web::web::ServiceConfig;
use serde::{Serialize, Deserialize};

use users::users;
use auth::auth;
use crm::crm;
use test::test;

use crate::models::user::User;

#[derive(Serialize, Deserialize)]
pub struct Response {
    code: u16,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    token: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    user: Option<User>
}

impl Response {
    pub fn not_found(thing: &str) -> Self {
        Response {code: 404, message: format!("ERROR: {thing} was not found"), token: None, user: None}
    }
    pub fn internal_server_error(err: &str) -> Self {
        Response {code: 500, message: format!("INTERNAL SERVER ERROR: {err}"), token: None, user: None}
    }
    pub fn bad_request(reason: &str) -> Self {
        Response {code: 400, message: format!("ERROR: {reason}"), token: None, user: None}
    }
    pub fn ok(message: &str, token: Option<String>, user: Option<User>) -> Self {
        Response {code: 200, message: message.to_string(), token, user}
    }
    pub fn unauthorized(reason: &str) -> Self {
        Response {code: 401, message: format!("ERROR: {reason}"), token: None, user: None}
    }
    
}

pub fn routes(conf: &mut ServiceConfig) {
    conf.service(auth());
    conf.service(users());
    conf.service(crm());
    conf.service(test());
}