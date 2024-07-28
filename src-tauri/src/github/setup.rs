/// Prepares octocrab instance
///
pub fn setup_octocrab(handle: tauri::AppHandle) -> octocrab::Octocrab {
    log::info!("Setting up octocrab");

    log::info!("Getting app_id");
    let raw_app_id = crate::secrets::get_app_id(&handle).unwrap();
    log::info!("Got app_id");
    log::info!("Parsing");
    let app_id = raw_app_id.parse::<u64>().unwrap();
    log::info!("Parsed app_id");

    log::info!("Getting installation_id");
    let raw_installation_id = crate::secrets::get_installation_id(&handle).unwrap();
    log::info!("Got installation_id");
    log::info!("Parsing");
    let installation_id = raw_installation_id.parse::<u64>().unwrap();
    log::info!("Parsed installation_id");

    log::info!("Getting rsa_private_key");
    let rsa_private_key = crate::secrets::get_rsa_private_key(&handle).unwrap();
    log::info!("Got rsa_private_key");
    log::info!("Parsing");
    let key = jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes()).unwrap();
    log::info!("Parsed rsa_private_key");

    log::info!("Building octocrab instance");
    let octocrab = octocrab::Octocrab::builder()
        .app(octocrab::models::AppId(app_id), key)
        .build()
        .unwrap();
    log::info!("Built octocrab instance");
    log::info!("Restricting octocrab to specific installation");
    let app = octocrab.installation(octocrab::models::InstallationId(installation_id));
    log::info!("Restricted octocrab to specific installation");

    log::info!("Octocrab is ready");
    app
}
