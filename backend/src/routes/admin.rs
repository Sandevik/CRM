use actix_http::body::{BoxBody, EitherBody};
use actix_web::{dev::{ServiceFactory, ServiceRequest, ServiceResponse}, post, web, Error, HttpResponse, Responder, Scope};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Deserialize, Serialize};
use crate::{controllers::database::{Database, Table}, routes::Response};
use crate::controllers::database::AlterOptions;
use crate::{middleware::admin_middleware::validator, AppState};


pub fn admin() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let admin_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/admin")
        .wrap(admin_middleware)
        .service(edit_table);
        
    scope
}




#[derive(Serialize, Deserialize)]
struct EditTableQuery {
    table: String, 
}

#[post("/alter-table")]
async fn edit_table(data: web::Data<AppState>, query: web::Query<EditTableQuery>, body: web::Json<AlterOptions>) -> impl Responder {
    let table: Table = match query.table.as_str() {
        "entries" => Table::Entries,
        "deals" => Table::Deals,
        "customers" => Table::Customers,
        "employees" => Table::Employees,
        "meetings" => Table::Meetings, 
        _ => return HttpResponse::BadRequest().json(Response::<String>::bad_request("Table does not exist"))
    };
    
    match Database::alter_table(table, body.0, &data).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::<String>::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::<String>::ok("Successfully altered tables", None))
    }
    
}