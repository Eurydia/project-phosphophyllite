/// Build octocrab instance from credentials in secrets directory
pub fn prepare_octocrab(handle: tauri::AppHandle) -> Result<octocrab::Octocrab, &'static str> {
    let raw_app_id = crate::secrets::get_app_id(handle.clone())?;
    let app_id = match raw_app_id.parse::<u64>() {
        Ok(app_id) => app_id,
        Err(err) => {
            log::error!("Rust cannot parse String to u64: \"{}\"", err);
            return Err("Cannot parse String to u64");
        }
    };

    log::trace!("Reading installation_id");
    let raw_installation_id = crate::secrets::get_installation_id(handle.clone())?;
    log::trace!("Parsing");
    let installation_id = match raw_installation_id.parse::<u64>() {
        Ok(installation_id) => installation_id,
        Err(err) => {
            log::error!("Cannot parse installation_id: {}", err);
            return Err("Cannot parse installation_id");
        }
    };

    log::trace!("Reading rsa_private_key");
    let rsa_private_key = crate::secrets::get_rsa_private_key(handle.clone())?;
    log::trace!("Decoding");
    let key = match jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes()) {
        Ok(key) => key,
        Err(err) => {
            log::error!("Cannot decode rsa_private_key: {}", err);
            return Err("Cannot decode rsa_private_key");
        }
    };

    log::trace!("Building octocrab");
    let octocrab = match octocrab::Octocrab::builder()
        .app(octocrab::models::AppId(app_id), key)
        .build()
    {
        Ok(octocrab) => octocrab,
        Err(err) => {
            log::error!("Cannot build octocrab: {}", err);
            return Err("Cannot build octocrab");
        }
    };

    log::trace!("Adding installation_id");
    let octocrab_with_installation_id =
        octocrab.installation(octocrab::models::InstallationId(installation_id));

    Ok(octocrab_with_installation_id)
}
