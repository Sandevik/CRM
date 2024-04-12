mod users;
mod auth;
mod crm;
mod customers;
mod meetings;
mod entries;
mod tasks;
mod employees;
mod companies;
mod test;

use actix_web::web::ServiceConfig;
use serde::Serialize;

use users::users_admin;
use users::users_user;
use auth::auth;
use crm::crm;
use meetings::meetings;
use entries::entries;
use tasks::tasks;
use test::test;
use employees::employees;
use companies::companies;
use self::crm::crm_from_employee_user;
use self::{customers::customers, crm::{create_crm, all_crms_by_user}};


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
    conf.service(users_admin());
    conf.service(users_user());

    conf.service(crm());
    conf.service(create_crm());
    conf.service(all_crms_by_user());
    conf.service(crm_from_employee_user());
    
    conf.service(customers());
    conf.service(meetings());
    conf.service(entries());
    conf.service(tasks());
    conf.service(employees());
    conf.service(companies());
    conf.service(test());
}

