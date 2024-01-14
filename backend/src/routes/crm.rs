use actix_web::{Scope, web::{self, ReqData}, Responder, HttpResponse, post, get, delete, dev::{ServiceRequest, ServiceFactory, ServiceResponse}, body::{EitherBody, BoxBody}, Error};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{AppState, controllers::jwt::Claims, routes::Response, models::{crm::CRM, user::User}};
use crate::middleware::user_middleware::validator;


pub fn crm() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let user_auth_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/crm")
        .wrap(user_auth_middleware)
        .service(crms)
        .service(create_crm)
        .service(remove_by_uuid);
        
    scope
}

#[derive(Serialize, Deserialize)]
struct CrmsResponse {
    crms: Vec<CRM>
}


#[get("")]
async fn crms(data: web::Data<AppState>, req_user: Option<ReqData<Claims>>) -> impl Responder {
    match req_user {
        None => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error("No user was found by middleware")),
        Some(claims) => {
            let crms = CRM::get_all_by_user(&claims.user, &data).await;
            match crms {
                Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
                Ok(crms) => HttpResponse::Ok().json(Response::<CrmsResponse>::ok("Successfully retrieved crms", Some(CrmsResponse {crms})))
            }
        }
    }
} 

#[derive(Deserialize)]
struct CreateBodyRequest {
    name: String,
}
#[post("/create")]
async fn create_crm(data: web::Data<AppState>, body: web::Json<CreateBodyRequest>, req_user: Option<ReqData<Claims>>) -> impl Responder {

    let user = &req_user.unwrap().user;

    //todo: get number of crm's the user has and check if user is allowed to create a new one

    //user is allowed to create a new crm:
    let new_crm = CRM::new(&data, &user, &body.name).await;

    match new_crm {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::<String>::created("Success! New CRM created."))
    }
}


#[get("/{uuid}")]
async fn read_crm(data: web::Data<AppState>, path: web::Path<String>, req_user: Option<ReqData<Claims>>) -> impl Responder {
    let crm_uuid: Uuid = Uuid::parse_str(path.into_inner().as_str()).unwrap_or_default();
    let user: &User = &req_user.unwrap().user;
    let is_admin: bool = user.admin;
    let is_owner: Result<bool, sqlx::Error> = CRM::user_owns(&user, crm_uuid, &data).await;
    match is_owner {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(is_owner) => {
            if is_owner || is_admin {
                match CRM::get_by_crm_uuid(&crm_uuid, &data).await {
                    Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
                    Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Deleted successfully", None))
                }
            } else {
                HttpResponse::Unauthorized().json(Response::<String>::unauthorized("You do not own this crm"))
            }        
        }
    }
}



#[delete("/{uuid}")]
async fn remove_by_uuid(data: web::Data<AppState>, path: web::Path<String>, req_user: Option<ReqData<Claims>>) -> impl Responder {
    let crm_uuid: Uuid = Uuid::parse_str(path.into_inner().as_str()).unwrap_or_default();
    let user: &User = &req_user.unwrap().user;
    let is_admin: bool = user.admin;
    let is_owner: Result<bool, sqlx::Error> = CRM::user_owns(&user, crm_uuid, &data).await;
    match is_owner {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(is_owner) => {
            if is_owner || is_admin {
                match CRM::remove_by_uuid(&data, &crm_uuid).await {
                    Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
                    Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Deleted successfully", None))
                }
            } else {
                HttpResponse::Unauthorized().json(Response::<String>::unauthorized("You do not own this crm"))
            }        
        }
    }
}

