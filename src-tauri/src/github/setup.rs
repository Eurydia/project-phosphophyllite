/// Prepares octocrab instance
///
pub fn setup_octocrab(handle: tauri::AppHandle) -> Result<octocrab::Octocrab, String> {
    let raw_app_id = crate::secrets::get_app_id(&handle)?;
    let app_id = raw_app_id.parse::<u64>().map_err(|err| err.to_string())?;

    let raw_installation_id = crate::secrets::get_installation_id(&handle)?;
    let installation_id = raw_installation_id
        .parse::<u64>()
        .map_err(|err| err.to_string())?;

    let rsa_private_key = crate::secrets::get_rsa_private_key(&handle)?;
    let key = jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes())
        .map_err(|err| err.to_string())?;

    let octocrab = octocrab::Octocrab::builder()
        .app(octocrab::models::AppId(app_id), key)
        .build()
        .map_err(|err| err.to_string())?;

    let app = octocrab.installation(octocrab::models::InstallationId(installation_id));

    Ok(app)
}
