use actix_web::{Scope, dev::{ServiceFactory, ServiceRequest, ServiceResponse}, body::{EitherBody, BoxBody}, Error, web, Responder, HttpResponse, get};
use actix_web_httpauth::middleware::HttpAuthentication;

use crate::middleware::owns_or_admin_middleware::validator;

pub fn clients() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let owner_or_admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/clients")
        .wrap(owner_or_admin_middleware)
        .service(index);
        
    scope
}


#[get("")]
async fn index() -> impl Responder {
    HttpResponse::Ok().json("hej")
}