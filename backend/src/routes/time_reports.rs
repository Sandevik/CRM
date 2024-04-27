use actix_web::{body::{EitherBody, BoxBody}, delete, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, get, post, put, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::NaiveDate;
use crate::{middleware::owns_or_admin_or_can_report_time::RequiresUuidAndEmployeeUuid, models::{time_report::TimeReport, Model}, routes::Response};
use crate::{middleware::owns_or_admin_or_can_report_time::validator, AppState};

use super::Limit;

pub fn time_reports() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_or_can_report_time_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/time-reports")
        .wrap(owns_or_admin_or_can_report_time_middleware)
        .service(get_by_week_and_year)
        ;
        
    scope
}

#[derive(Deserialize)]
struct WeekAndYearQuery {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "employeeUuid"))]
    employee_uuid: String,
    week: u32,
    year: i32
}

#[get("")]
async fn get_by_week_and_year(query: web::Query<WeekAndYearQuery>, data: web::Data<AppState>) -> impl Responder {
    let crm_uuid = Uuid::parse_str(&query.crm_uuid.clone()).expect("ERROR: Could not parse crmUuid @ time_reports.rs");
    let employee_uuid = Uuid::parse_str(&query.employee_uuid.clone()).expect("ERROR: Could not parse employeeUuid @ time_reports.rs");
    
    match TimeReport::get_all_by_week_and_year(&crm_uuid, &employee_uuid, query.week, query.year, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(reports) =>  HttpResponse::Ok().json(Response::ok("Successfully fetched reports for employee", Some(reports)))
    }
}

/* #[get("")]
async fn get_by_month(query: web::Query<RequiresUuidAndEmployeeUuid>, data: web::Data<AppState>) -> impl Responder {
    TimeReport::get
} */