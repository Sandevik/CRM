use actix_http::body::{BoxBody, EitherBody};
use actix_web::{delete, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, get, post, put, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::routes::Response;

use crate::{middleware::owns_or_admin_middleware::validator, models::entry::Entry, AppState};


pub fn entries() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/entries")
        .wrap(owns_or_admin_middleware)
        .service(create_entry)
        .service(edit_entry)
        .service(get_all_by_client_uuid)
        .service(delete_entry);
        
    scope
}


#[derive(Serialize, Deserialize)]
struct CreateEntryRequest {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: String,
    content: String,
    #[serde(rename(deserialize = "addedAtMeeting"))]
    added_at_meeting: Option<String>,
}


#[post("/create")]
async fn create_entry(data: web::Data<AppState>, body: web::Json<CreateEntryRequest>) -> impl Responder {
    match Entry::new(&body.content, Uuid::parse_str(&body.client_uuid).unwrap_or_default(), match &body.added_at_meeting { Some(str_uuid) => Some(Uuid::parse_str(&str_uuid).unwrap_or_default()), None => None})
        .insert(Uuid::parse_str(&body.crm_uuid).unwrap_or_default(), &data).await {
            Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
            Ok(_) => HttpResponse::Created().json(Response::<String>::created("Successfully created entry"))
    }
}
    
    
#[derive(Serialize, Deserialize)]
struct UpdateRequestBody {
    content: String,
    added_at_meeting: Option<String>
}

#[derive(Serialize, Deserialize)]
struct UpdateQuery {
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String,
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: String,

}


#[put("")]
async fn edit_entry(data: web::Data<AppState>, body: web::Json<UpdateRequestBody>, query: web::Query<UpdateQuery>) -> impl Responder {
    let entry: Entry = Entry::new(&body.content, Uuid::parse_str(&query.client_uuid).unwrap_or_default(), match &body.added_at_meeting { Some(str_uuid) => Some(Uuid::parse_str(&str_uuid).unwrap_or_default()), None => None});
    match entry.update(Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &data).await {
            Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
            Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully updated entry", None))
        }
}

#[get("/all")]
async fn get_all_by_client_uuid(data: web::Data<AppState>, query: web::Query<UpdateQuery>) -> impl Responder {
    match Entry::get_all_by_client_uuid(&Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &Uuid::parse_str(&query.client_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(entries) => HttpResponse::Ok().json(Response::ok("Successfully updated entry", Some(entries)))
    }
}


#[derive(Serialize, Deserialize)]
struct DeleteRequest {
    id: i32,
    #[serde(rename(deserialize = "crmUuid"))]
    crm_uuid: String

}

#[delete("")]
async fn delete_entry(data: web::Data<AppState>, query: web::Query<DeleteRequest>) -> impl Responder {
    match Entry::delete_by_id(query.id.clone(), &Uuid::parse_str(&query.crm_uuid).unwrap_or_default(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully deleted entry", None))
    }
}