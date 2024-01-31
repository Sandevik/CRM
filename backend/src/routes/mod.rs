mod users;
mod auth;
mod crm;
mod clients;
mod meetings;
mod entries;
mod test;

use actix_web::web::ServiceConfig;
use serde::Serialize;

use users::users;
use auth::auth;
use crm::crm;
use meetings::meetings;
use entries::entries;
use test::test;

use self::{clients::clients, crm::{create_crm, all_crms_by_user}};


#[derive(Serialize)]
pub struct Response<T> {
    code: u16,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>
}

impl<T> Response<T> {
    pub fn ok(message: &str, data: Option<T>) -> Self where T: Serialize {
        Response {
            code: 200,
            message: message.to_string(),
            data
        }
    }

    pub fn internal_server_error(reason: &str) -> Self {
        Response {
            code: 500,
            message: reason.to_string(),
            data: None
        }
    }

    pub fn bad_request(reason: &str) -> Self {
        Response {
            code: 400,
            message: reason.to_string(),
            data: None,
        }
    }

    pub fn created(message: &str) -> Self {
        Response {
            code: 201,
            message: message.to_string(),
            data: None
        }
    }

    pub fn not_found(reason: &str) -> Self {
        Response {
            code: 404, 
            message: reason.to_string(), 
            data: None
        }
    }

    pub fn unauthorized(reason: &str) -> Self {
        Response {
            code: 401,
            message: reason.to_string(),
            data: None
        }
    }



}

#[derive(PartialEq)]
pub enum MeetingsOption {
    All,
    Future,
    Past,
    ThisMonth,
    ByYearAndMonth((i32, u8))
}

pub enum Limit {
    None,
    Some(u16)
}


pub fn routes(conf: &mut ServiceConfig) {
    conf.service(auth());
    conf.service(users());
    conf.service(crm());
    conf.service(create_crm());
    conf.service(all_crms_by_user());
    conf.service(clients());
    conf.service(meetings());
    conf.service(entries());
    conf.service(test());
}

