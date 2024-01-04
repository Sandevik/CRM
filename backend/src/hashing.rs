use pbkdf2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Pbkdf2
};
pub struct Hashing ();

impl Hashing {

    pub fn hash(password: String) -> String {
        let salt = SaltString::generate(&mut OsRng);
        Pbkdf2.hash_password(password.as_bytes(), &salt).expect("ERROR: Could not hash password").to_string()
    }

    pub fn verify(password: String, password_hash: &str) -> Result<(), pbkdf2::password_hash::Error> {
        let parsed_hash = PasswordHash::new(&password_hash).expect("ERROR: Could not parse password hash");
        Pbkdf2::verify_password(&Pbkdf2, password.as_bytes(), &parsed_hash)
    }

}