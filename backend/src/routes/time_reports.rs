use actix_web::{body::{BoxBody, EitherBody}, delete, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, get, post, put, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::Deserialize;
use sqlx::query;
use uuid::Uuid;
use chrono::{DateTime, NaiveDate, NaiveDateTime, TimeZone, Utc};
use crate::{middleware::owns_or_admin_or_can_report_time::RequiresUuidAndEmployeeUuid, models::{time_report::TimeReport, Model, _break::Break}, routes::Response};
use crate::{middleware::owns_or_admin_or_can_report_time::validator, AppState};


pub fn time_reports() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_or_can_report_time_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/time-reports")
        .wrap(owns_or_admin_or_can_report_time_middleware)
        .service(get_by_week_and_year)
        .service(add_break)
        .service(update_break)
        .service(delete_break)
        .service(update_time_report)
        .service(clear_time_report)
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
        Ok(mut reports) => {
            for report in &mut reports {
                report.get_breaks(&data).await.expect(&format!("ERROR: Could not retrieve breaks for time report {}", report.uuid));
            }
            HttpResponse::Ok().json(Response::ok("Successfully fetched reports for employee", Some(reports)))
        }
    }
}


#[derive(Deserialize)]
struct AddBreakReq {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "employeeUuid"))]
    employee_uuid: String,
    #[serde(rename(deserialize = "timeReportUuid"))]
    time_report_uuid: String,
    #[serde(rename(deserialize = "startDateTime"))]
    start_date_time: i64,
    #[serde(rename(deserialize = "endDateTime"))]
    end_date_time: i64,
    #[serde(rename(deserialize = "scheduleDate"))]
    schedule_date: String,
    note: Option<String>,
}

#[post("/break")]
async fn add_break(body: web::Json<AddBreakReq>, data: web::Data<AppState>) -> impl Responder {
    let start_date_time: DateTime<Utc> = Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(body.start_date_time).expect("Could not convert milliseconds to date")).unwrap();
    let end_date_time: DateTime<Utc> = Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(body.end_date_time).expect("Could not convert milliseconds to date")).unwrap();

    let _break = Break {
        start_date_time,
        end_date_time,
        note: body.note.clone(),
        crm_uuid: Uuid::parse_str(&body.crm_uuid).expect("ERROR: Could not parse crm uuid"),
        time_report_uuid: Uuid::parse_str(&body.time_report_uuid).expect("ERROR: Could not parse time_report uuid"),
        employee_uuid: Uuid::parse_str(&body.employee_uuid).expect("ERROR: Could not parse time_report uuid"),
        schedule_date: NaiveDate::parse_from_str(&body.schedule_date.clone(), "%Y-%m-%d").expect(&format!("ERROR: The given schedule date had faulty format. Expected year-month-day, got: {}", &body.schedule_date)),
        ..Break::default()
    };

    match _break.insert(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) =>  HttpResponse::Created().json(Response::<String>::created("Successfully added break to time report"))
    }
}

#[derive(Deserialize)]
struct UpdateBreakReq {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "employeeUuid"))]
    employee_uuid: String,
    #[serde(rename(deserialize = "timeReportUuid"))]
    time_report_uuid: String,
    #[serde(rename(deserialize = "breakUuid"))]
    break_uuid: String,
    #[serde(rename(deserialize = "startDateTime"))]
    start_date_time: i64,
    #[serde(rename(deserialize = "endDateTime"))]
    end_date_time: i64,
    note: Option<String>,
}

#[put("/break")]
async fn update_break(body: web::Json<UpdateBreakReq>, data: web::Data<AppState>) -> impl Responder {
    let start_date_time: DateTime<Utc> = Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(body.start_date_time).expect("Could not convert milliseconds to date")).unwrap();
    let end_date_time: DateTime<Utc> = Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(body.end_date_time).expect("Could not convert milliseconds to date")).unwrap();

    let _break = Break {
        break_uuid: Uuid::parse_str(&body.break_uuid).expect("ERROR: Could not parse break uuid @ time_reports.rs"),
        start_date_time,
        end_date_time,
        note: body.note.clone(),
        crm_uuid: Uuid::parse_str(&body.crm_uuid).expect("ERROR: Could not parse crm uuid @ time_reports.rs"),
        time_report_uuid: Uuid::parse_str(&body.time_report_uuid).expect("ERROR: Could not parse time report uuid @ time_reports.rs"),
        employee_uuid: Uuid::parse_str(&body.employee_uuid).expect("ERROR: Could not parse employee uuid @ time_reports.rs"),
        ..Break::default()
    };

    match _break.update(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) =>  HttpResponse::Ok().json(Response::<String>::ok("Successfully updated break in time report", None))
    }

}

#[derive(Deserialize)]
struct DeleteBreakReq {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "employeeUuid"))]
    employee_uuid: String,
    #[serde(rename(deserialize = "breakUuid"))]
    break_uuid: String,
}

#[delete("/break")]
async fn delete_break(body: web::Query<DeleteBreakReq>, data: web::Data<AppState>) -> impl Responder {
    match Break::delete_by_uuid(&Uuid::parse_str(&body.break_uuid).expect("ERROR: Could not parse time report uuid @ time_reports.rs"), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) =>  HttpResponse::Ok().json(Response::<String>::ok("Successfully deleted break from time report", None))
    }
}


#[derive(Deserialize)]
struct UpdateTimeReportReq {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "employeeUuid"))]
    employee_uuid: String,
    #[serde(rename(serialize = "startDateTime", deserialize = "startDateTime"))]
    start_date_time: Option<i64>,
    #[serde(rename(deserialize = "scheduleDate"))]
    schedule_date: String,
    #[serde(rename(serialize = "endDateTime", deserialize = "endDateTime"))]
    end_date_time: Option<i64>,
    note: Option<String>,
}


#[put("/{uuid}")]
async fn update_time_report(uuid: web::Path<String>, body: web::Json<UpdateTimeReportReq>, data: web::Data<AppState>) -> impl Responder {
    let start_date_time: Option<DateTime<Utc>> = match body.start_date_time {None => None, Some(date) =>  Some(Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(date).expect("Could not convert milliseconds to date")).unwrap())};
    let end_date_time: Option<DateTime<Utc>> = match body.end_date_time {None => None, Some(date) =>  Some(Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(date).expect("Could not convert milliseconds to date")).unwrap())};
    let schedule_date = NaiveDate::parse_from_str(&body.schedule_date, "%Y-%m-%d").expect("ERROR: Could not parse schedule date @ time_reports.rs");
    let time_report: TimeReport = TimeReport {
        crm_uuid: Uuid::parse_str(&body.crm_uuid.clone()).expect("ERROR: Could not parse crm_uuid @ time_reports.rs"),
        uuid: Uuid::parse_str(&uuid).expect("ERROR: Could not parse uuid, most likely a faulty uuid @ time_reports.rs"),
        employee_uuid: Uuid::parse_str(&body.employee_uuid.clone()).expect("ERROR: Could not parse employee_uuid @ time_reports.rs"),
        start_date_time,
        end_date_time,
        schedule_date,
        note: body.note.clone(),
        ..TimeReport::default()
    };

    match time_report.update(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) =>  HttpResponse::Ok().json(Response::<String>::ok("Successfully updated time report", None))
    }
}


#[delete("/{uuid}")]
async fn clear_time_report(uuid: web::Path<String>, query: web::Query<RequiresUuidAndEmployeeUuid>, data: web::Data<AppState>) -> impl Responder {

    let time_report: TimeReport = TimeReport {
        uuid: Uuid::parse_str(&uuid).expect("ERROR: Could not parse uuid, most likely a faulty uuid @ time_reports.rs"),
        crm_uuid: Uuid::parse_str(&query.crm_uuid).expect("ERROR: Could not parse crm uuid @ time_reports.rs"),
        employee_uuid: Uuid::parse_str(&query.employee_uuid).expect("ERROR: Could not parse employee uuid @ time_reports.rs"),
        ..TimeReport::default()
    };

    match time_report.delete(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) =>  HttpResponse::Ok().json(Response::<String>::ok("Successfully updated time report", None))
    }
}


