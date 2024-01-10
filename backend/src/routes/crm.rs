use actix_web::{Scope, web, Responder, HttpResponse, post};



pub fn crm() -> Scope {
    let scope = web::scope("/crm")
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(create_crm);
        
    scope
}

async fn index() -> impl Responder {
    HttpResponse::Ok().body("crm route")
} 


#[post("/create")]
async fn create_crm() -> impl Responder {


    HttpResponse::Ok().json("test")
}

