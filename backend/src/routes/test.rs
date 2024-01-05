use actix_web::{Scope, web::{self}, Responder, HttpResponse, get};

use crate::controllers::hashing::Hashing;

pub fn test() -> Scope {
    let scope = web::scope("/test")
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(generate_hash);
    scope
}

async fn index() -> impl Responder {
    HttpResponse::Ok().json("test")
}

#[get("/generate-hash")]
async fn generate_hash() -> impl Responder {
    
    HttpResponse::Ok().json(Hashing::hash("test".to_string()))
}