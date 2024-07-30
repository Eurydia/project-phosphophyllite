/// Prepares octocrab instance
///
pub fn setup_octocrab(handle: tauri::AppHandle) -> Result<octocrab::Octocrab, &'static str> {
    log::trace!("Setting up octocrab");

    log::trace!("Getting app_id");
    let app_id = match crate::secrets::get_app_id(handle.clone()) {
        Ok(raw_app_id) => {
            log::trace!("Parsing");
            match raw_app_id.parse::<u64>() {
                Ok(app_id) => app_id,
                Err(err) => {
                    log::error!("Error found while trying to parse app_id: {}", err);
                    return Err("Something went wrong while parsing app_id");
                }
            }
        }
        Err(err) => {
            log::error!("Error found while trying to get app_id: {}", err);
            return Err("Something went wrong while getting app_id");
        }
    };

    log::trace!("Getting installation_id");
    let installation_id = match crate::secrets::get_installation_id(handle.clone()) {
        Ok(raw_installation_id) => {
            log::trace!("Parsing");
            match raw_installation_id.parse::<u64>() {
                Ok(installation_id) => installation_id,
                Err(err) => {
                    log::error!("Error found while trying to parse installation_id: {}", err);
                    return Err("Something went wrong while parsing installation_id");
                }
            }
        }
        Err(err) => {
            log::error!("Error found while trying to get installation_id: {}", err);
            return Err("Something went wrong while getting installation_id");
        }
    };

    log::trace!("Getting rsa_private_key");
    let key = match crate::secrets::get_rsa_private_key(handle.clone()) {
        Ok(rsa_private_key) => {
            log::trace!("Decoding");
            match jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes()) {
                Ok(key) => key,
                Err(err) => {
                    log::error!(
                        "Error found while trying to decode rsa_private_key: {}",
                        err
                    );
                    return Err("Something went wrong while decoding rsa_private_key");
                }
            }
        }
        Err(err) => {
            log::error!("Error found while trying to get rsa_private_key: {}", err);
            return Err("Something went wrong while getting rsa_private_key");
        }
    };

    log::trace!("Building octocrab instance");
    match octocrab::Octocrab::builder()
        .app(octocrab::models::AppId(app_id), key)
        .build()
    {
        Ok(octocrab) => {
            log::trace!("Restricting octocrab to specific installation");
            Ok(octocrab.installation(octocrab::models::InstallationId(installation_id)))
        }
        Err(err) => {
            log::error!(
                "Error found while trying to build octocrab instance: {}",
                err
            );
            Err("Something went wrong while building octocrab instance")
        }
    }
}
