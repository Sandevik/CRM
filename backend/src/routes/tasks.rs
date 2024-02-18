use actix_web::{body::{EitherBody, BoxBody}, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, post, get, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{middleware::owns_or_admin_middleware::validator, models::task::{Recurrence, Task, TaskStatus}, AppState};
use crate::routes::Response;


pub fn tasks() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/tasks")
        .wrap(owns_or_admin_middleware)
        .service(create_task)
        .service(get_by_client)
        .service(complete_task);
        
    scope
}

#[derive(Deserialize)]
struct CreateTodoRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    deadline: Option<i64>,
    start: Option<i64>,
    recurrence: Option<String>,
    status: Option<String>,
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: Option<String>,
    title: Option<String>,
}

#[post("/create")]
async fn create_task(data: web::Data<AppState>, body: web::Json<CreateTodoRequest>) -> impl Responder {
    let custom_start_date: Option<DateTime<Utc>> = match body.start {None => Task::default().start, Some(i) => Some(Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(i).expect("Could not convert milliseconds to date")).unwrap())};
    let deadline: Option<DateTime<Utc>> = match body.deadline {None => None, Some(i) => Some(Utc.from_local_datetime(&NaiveDateTime::from_timestamp_millis(i).expect("Could not convert milliseconds to date")).unwrap())};
    let crm_uuid: Uuid = Uuid::parse_str(&body.crm_uuid).unwrap_or_default();
    let client_uuid: Option<Uuid> = match &body.client_uuid { Some(uuid) => Some(Uuid::parse_str(&uuid).unwrap_or_default()), None => None};
    let recurrence: Option<Recurrence> = match &body.recurrence {None => None, Some(str) => Recurrence::from_string(str)};
    let todo: Task = Task {
        client_uuid, 
        crm_uuid, 
        start: custom_start_date,
        deadline, 
        recurrence_count: match &recurrence {None => None, Some(_) => Some(1)},
        recurrence,
        title: body.title.clone(),
        status: if let None = &body.status {None} else {Some(TaskStatus::from_string(&body.status.clone().unwrap()))},
        ..Task::default()
    }; 

    match todo.insert(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::<String>::created("Successfully created todo"))
    }
}


#[derive(Serialize, Deserialize)]
struct ByClientRequestQuery {
    #[serde(rename(serialize = "crmUuid", deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(serialize = "clientUuid", deserialize = "clientUuid"))]
    client_uuid: String
}

#[get("/by-client")]
async fn get_by_client(data: web::Data<AppState>, query: web::Query<ByClientRequestQuery>) -> impl Responder {
    match Task::get_by_client_uuid(&Uuid::parse_str(&query.client_uuid).unwrap_or_default(), &Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(tasks) =>  HttpResponse::Ok().json(Response::ok("Successfully fetched tasks", Some(tasks)))
    }
}


#[derive(Serialize, Deserialize)]
struct CompleteTaskRequest {
    #[serde(rename(deserialize = "taskUuid"))]
    task_uuid: String,
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
}

#[post("/complete")]
async fn complete_task(data: web::Data<AppState>, body: web::Json<CompleteTaskRequest>) -> impl Responder {
    let task = Task {uuid: Uuid::parse_str(&body.task_uuid).unwrap_or_default(), crm_uuid: Uuid::parse_str(&body.crm_uuid).unwrap_or_default(), ..Task::default()};
    match task.complete_task(&data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(tasks) => HttpResponse::Ok().json(Response::ok("Successfully fetched tasks", Some(tasks)))
    }
}