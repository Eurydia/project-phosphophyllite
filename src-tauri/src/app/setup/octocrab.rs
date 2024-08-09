/// Build octocrab instance from credentials in secrets directory
///
/// This function reads the app id, installation id, and RSA private key from the secrets directory.
/// It then builds an octocrab instance with these credentials.
///
/// # Error
///
/// There are a few points of errors.
/// - while reading secrets,
/// - while parsing and decoding the credentials,
/// - while building the octocrab instance.
pub fn prepare_octocrab(handle: tauri::AppHandle) -> Result<octocrab::Octocrab, &'static str> {
    let raw_app_id = crate::secrets::get_app_id(handle.clone())?;
    let app_id = match raw_app_id.parse::<u64>() {
        Ok(app_id) => octocrab::models::AppId(app_id),
        Err(err) => {
            log::error!("Rust cannot parse String to u64: \"{}\"", err);
            return Err("Cannot parse String to u64");
        }
    };

    let raw_installation_id = crate::secrets::get_installation_id(handle.clone())?;
    let installation_id = match raw_installation_id.parse::<u64>() {
        Ok(installation_id) => octocrab::models::InstallationId(installation_id),
        Err(err) => {
            log::error!("Rust cannot parse String to u64: \"{}\"", err);
            return Err("Cannot parse String to u64");
        }
    };

    let pem = crate::secrets::get_rsa_private_key(handle.clone())?;
    let key = match jsonwebtoken::EncodingKey::from_rsa_pem(pem.as_bytes()) {
        Ok(key) => key,
        Err(err) => {
            log::error!("jsonwebtoken cannot decode rsa pem: \"{}\"", err);
            return Err("Cannot decode rsa pem");
        }
    };

    match octocrab::Octocrab::builder().app(app_id, key).build() {
        Ok(octocrab) => Ok(octocrab.installation(installation_id)),
        Err(err) => {
            log::error!("Octocrab cannot build instance: \"{}\"", err);

            Err("Cannot build octocrab")
        }
    }
}
