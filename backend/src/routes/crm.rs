use actix_web::{Scope, web::{self, ReqData}, Responder, HttpResponse, post, get, delete, dev::{ServiceRequest, ServiceFactory, ServiceResponse}, body::{EitherBody, BoxBody}, Error};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{AppState, controllers::jwt::Claims, routes::Response, models::{crm::CRM}, middleware::{owns_or_admin_middleware::RequiresUuid, user_middleware::{self, validator}}};
use crate::middleware::owns_or_admin_middleware::validator as owner_validator;


pub fn create_crm() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>>  {
    let user_middleware = HttpAuthentication::bearer(validator);
    let scope = web::scope("/create-crm")
        .wrap(user_middleware)
        .service(create)        ;

    scope
}

/* 
###########
The routes are secured by login
###########
*/

#[derive(Deserialize)]
struct CreateBodyRequest {
    name: String,
}
#[post("/create")]
async fn create(data: web::Data<AppState>, body: web::Json<CreateBodyRequest>, req_user: Option<ReqData<Claims>>) -> impl Responder {
    let user = &req_user.unwrap().user;

    //todo: get number of crm's the user has and check if user is allowed to create a new one

    //user is allowed to create a new crm:
    let new_crm = CRM::new(&data, &user, &body.name).await;

    match new_crm {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::<String>::created("Success! New CRM created."))
    }
}






pub fn all_crms_by_user() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>>  {
    let user_middleware = HttpAuthentication::bearer(validator);
    let scope = web::scope("/all-crms")
        .wrap(user_middleware)
        .service(crms)        ;

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







pub fn crm() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owns_or_admin_middleware = HttpAuthentication::bearer(owner_validator);
    
    let scope = web::scope("/crm")
        .wrap(owns_or_admin_middleware)
        .service(remove_by_uuid)
        .service(read_crm);
        
    scope
}

/* 
###########
The routes are secured by login and ownership
###########
*/


#[get("")]
async fn read_crm(data: web::Data<AppState>, query: web::Query<RequiresUuid>) -> impl Responder {
    let crm_uuid_string = &query.uuid;
    
    match CRM::get_by_crm_uuid(&Uuid::parse_str(crm_uuid_string).unwrap(), &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(maybe_crm) => {
            match maybe_crm {
                None => HttpResponse::NotFound().json(Response::<String>::not_found("Crm does not exist")),
                Some(mut crm) => {
                    crm.get_meetings(crate::routes::MeetingsOption::Future, crate::routes::Limit::Some(2), &data).await;
                    crm.get_clients(crate::routes::Limit::None, &data).await;
                    HttpResponse::Ok().json(Response::<CRM>::ok("Fetch successful", Some(crm)))
                }
            }
        }
    }
}



#[delete("")]
async fn remove_by_uuid(data: web::Data<AppState>, query: web::Query<RequiresUuid>, req_user: Option<ReqData<Claims>>) -> impl Responder {
    let crm_uuid_string = &query.uuid;
    match CRM::remove_by_uuid(&data, &Uuid::parse_str(crm_uuid_string).unwrap()).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Deleted successfully", None))
    }
}

