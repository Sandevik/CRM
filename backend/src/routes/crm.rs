use actix_web::{Scope, web, Responder, HttpResponse, post, delete};
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{extractors::authentication::AuthenticationToken, AppState, models::user::User, controllers::{crm::CRM, database::Database}, routes::Response};



pub fn crm() -> Scope {
    let scope = web::scope("/crm")
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(create_crm)
        .service(remove_by_uuid);
        
    scope
}

async fn index() -> impl Responder {
    HttpResponse::Ok().body("crm route")
} 


#[post("/create")]
async fn create_crm(data: web::Data<AppState>, auth_token: AuthenticationToken) -> impl Responder {

    let user: User = auth_token.user;

    //todo: get number of crm's the user has and check if user is allowed to create a new one

    //user is allowed to create a new crm:
    let new_crm = CRM::new(&data, &user).await;

    match new_crm {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::created("Success! New CRM created."))
    }
}


#[derive(Serialize, Deserialize)]
struct DeleteBodyRequest {
    uuid: Uuid,
}

#[delete("/")]
async fn remove_by_uuid(data: web::Data<AppState>, body: web::Json<DeleteBodyRequest>) -> impl Responder {
    
    
    //todo! only an admin or a user that is the owner of the crm should be able to remove


    match CRM::remove_by_uuid(&data, &body.uuid).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::ok("Deleted successfully", None, None))
    }

}

