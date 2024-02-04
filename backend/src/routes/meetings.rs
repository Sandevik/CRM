use actix_web::{Scope, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, body::{EitherBody, BoxBody}, Error, web, get, Responder, HttpResponse, post, delete};
use actix_web_httpauth::middleware::HttpAuthentication;
use chrono::{Datelike, NaiveDateTime};
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{middleware::owns_or_admin_middleware::{validator, RequiresUuid}, AppState, models::meeting::Meeting};

use super::{MeetingsOption, Response, Limit};



pub fn meetings() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/meetings")
        .wrap(owns_or_admin_middleware)
        .service(meetings_this_month)
        .service(meetings_by_year_and_month)
        .service(create_meeting)
        .service(upcoming_meetings)
        .service(read_meeting)
        .service(delete_meeting)
        .service(get_by_client_uuid);
        
    scope
}

#[derive(Serialize)]
struct MeetingWithDay {
    meeting: Meeting,
    day: u8,
}

#[get("/this-month")]
async fn meetings_this_month(data: web::Data<AppState>, query: web::Query<RequiresUuid>) -> impl Responder {
    let crm_uuid = Uuid::parse_str(&query.crm_uuid).unwrap_or_default();
    match Meeting::get_all(&crm_uuid, MeetingsOption::ThisMonth, Limit::None, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(meetings) => {
            let meetings_with_days: Vec<MeetingWithDay> = meetings.iter().map(|meeting| {
                MeetingWithDay { meeting: meeting.clone(), day: meeting.clone().from.day() as u8 }
            }).collect();
            HttpResponse::Ok().json(Response::ok("Successfully retrieved meetings", Some(meetings_with_days)))
        }
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
        Ok(meetings) => {
            let meetings_with_days: Vec<MeetingWithDay> = meetings.iter().map(|meeting| {
                MeetingWithDay { meeting: meeting.clone(), day: meeting.clone().from.day() as u8 }
            }).collect();
            HttpResponse::Ok().json(Response::ok("Successfully retrieved meetings", Some(meetings_with_days)))
        }
    }
}



#[get("/upcoming")]
async fn upcoming_meetings(data: web::Data<AppState>, query: web::Query<RequiresUuid>) -> impl Responder {
    let crm_uuid = Uuid::parse_str(&query.crm_uuid).unwrap_or_default();
    match Meeting::get_all(&crm_uuid, MeetingsOption::Future, Limit::Some(2), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(meetings) => {
            HttpResponse::Ok().json(Response::ok("Successfully retrieved meetings", Some(meetings)))
        }
    }
}


#[derive(Deserialize, Serialize, Debug)]
struct CreateMeetingRequest {
    from: i64,
    to: i64,
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: String,
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
}

#[post("/create")]
pub async fn create_meeting(data: web::Data<AppState>, body: web::Json<CreateMeetingRequest>) -> impl Responder {
    let from = NaiveDateTime::from_timestamp_millis(body.from).expect("Could not convert milliseconds to date");
    let to = NaiveDateTime::from_timestamp_millis(body.to).expect("Could not convert milliseconds to date");
    match Meeting::new(from, to, &Uuid::parse_str(&body.client_uuid.as_str()).unwrap_or_default()).insert(&data, &Uuid::parse_str(body.crm_uuid.as_str()).unwrap_or_default()).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::<String>::created("Successfully created meeting"))
    }
}




#[derive(Serialize, Deserialize)]
struct MeetingByUuidRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String, //crm uuid
    uuid: String,
}

#[get("")]
pub async fn read_meeting(data: web::Data<AppState>, query: web::Query<MeetingByUuidRequest>) -> impl Responder {
    match Meeting::get_by_uuid(&Uuid::parse_str(&query.uuid).unwrap_or_default(), &Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(meeting) => HttpResponse::Ok().json(Response::ok("Successfully read meeting", meeting))
    }
}

#[delete("")]
pub async fn delete_meeting(data: web::Data<AppState>, query: web::Query<MeetingByUuidRequest>) -> impl Responder {
    match Meeting::delete_by_uuid(&Uuid::parse_str(&query.uuid).unwrap_or_default(), &Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully deleted meeting", None))
    }
}

#[derive(Serialize, Deserialize)]
struct MeetingsByClientRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String, //crm uuid
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: String,
}
#[get("/by-client")]
pub async fn get_by_client_uuid(data: web::Data<AppState>, query: web::Query<MeetingsByClientRequest>) -> impl Responder {
    match Meeting::get_all_by_client_uuid(&Uuid::parse_str(&query.client_uuid).unwrap_or_default(), &Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), MeetingsOption::All, Limit::Some(20), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(meetings) => HttpResponse::Ok().json(Response::ok("Successfully fetched meetings", Some(meetings)))
    }
}