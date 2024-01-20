use actix_web::{Scope, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, body::{EitherBody, BoxBody}, Error, web, get, Responder, HttpResponse};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{middleware::owns_or_admin_middleware::{validator, RequiresUuid}, AppState, models::meeting::Meeting};

use super::{MeetingsOption, Response, Limit};



pub fn meetings() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/meetings")
        .wrap(owns_or_admin_middleware)
        .service(meetings_this_month)
        .service(meetings_by_year_and_month);
        
    scope
}


#[get("/this-month")]
async fn meetings_this_month(data: web::Data<AppState>, query: web::Query<RequiresUuid>) -> impl Responder {
    let crm_uuid = Uuid::parse_str(&query.uuid).unwrap_or_default();

    match Meeting::get_all(&crm_uuid, MeetingsOption::ThisMonth, Limit::None, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(meetings) => HttpResponse::Ok().json(Response::ok("Successfully retrieved meetings", Some(meetings)))
    }
}


#[derive(Serialize, Deserialize)]
struct ByYearAndMonthRequest{
    year: i32,
    month: u8,
    uuid: String,
}

#[get("")]
async fn meetings_by_year_and_month(data: web::Data<AppState>, query: web::Query<ByYearAndMonthRequest>) -> impl Responder {
    let crm_uuid = Uuid::parse_str(&query.uuid).unwrap_or_default();

    match Meeting::get_all(&crm_uuid, MeetingsOption::ByYearAndMonth((query.year, query.month)), Limit::None, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(meetings) => HttpResponse::Ok().json(Response::ok("Successfully retrieved meetings", Some(meetings)))
    }
}



#[derive(Serialize, Deserialize)]
struct MeetingByUuidRequest {
    uuid: String, //crm uuid
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: String,
}
