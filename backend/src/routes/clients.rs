use actix_web::{Scope, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, body::{EitherBody, BoxBody}, Error, web, Responder, HttpResponse, get};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;
use crate::routes::Response;
use crate::{middleware::owns_or_admin_middleware::validator, AppState, models::client::Client};

pub fn clients() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owner_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/clients")
        .wrap(owner_or_admin_middleware)
        .service(by_uuid);
        
    scope
}

#[derive(Serialize, Deserialize)]
struct ClientByUuidRequest {
    uuid: String, //crm uuid
    #[serde(rename(deserialize = "clientUuid"))]
    client_uuid: String,
}

#[get("")]
async fn by_uuid(query: web::Query<ClientByUuidRequest>, data: web::Data<AppState>) -> impl Responder {
    let client_uuid = Uuid::parse_str(&query.client_uuid).unwrap_or_default();
    let crm_uuid = Uuid::parse_str(&query.uuid).unwrap_or_default();
    match Client::get_by_uuid(&client_uuid, &crm_uuid, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(client) => HttpResponse::Ok().json(Response::ok("Successfully fetched client",client))
    }
}