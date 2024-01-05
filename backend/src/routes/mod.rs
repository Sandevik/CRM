mod users;
mod auth;
mod test;

use actix_web::web::ServiceConfig;
use serde::{Serialize, Deserialize};

use users::users;
use auth::auth;
use test::test;

#[derive(Serialize, Deserialize)]
pub struct Response {
    code: u16,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    token: Option<String>
}

impl Response {
    pub fn not_found(thing: &str) -> Self {
        Response {code: 404, message: format!("ERROR: {thing} was not found"), token: None}
    }
    pub fn internal_server_error(err: &str) -> Self {
        Response {code: 500, message: format!("INTERNAL SERVER ERROR: {err}"), token: None}
    }
    pub fn bad_request(reason: &str) -> Self {
        Response {code: 400, message: format!("ERROR: {reason}"), token: None}
    }
    pub fn ok(message: &str, token: Option<String>) -> Self {
        Response {code: 200, message: message.to_string(), token}
    }
}

fn token_not_exist(response: &Response) -> bool {
    response.token.is_none()
}

pub fn routes(conf: &mut ServiceConfig) {
    conf.service(auth());
    conf.service(users());
    conf.service(test());
}