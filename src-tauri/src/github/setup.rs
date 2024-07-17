pub fn get_octocrab(handle: tauri::AppHandle) -> Result<octocrab::Octocrab, String> {
    let app_id = crate::secrets::get_app_id(&handle)?
        .parse::<u64>()
        .map_err(|err| err.to_string())?;
    let installation_id = crate::secrets::get_installation_id(&handle)?
        .parse::<u64>()
        .map_err(|err| err.to_string())?;

    let rsa_private_key = crate::secrets::get_rsa_private_key(&handle)?;
    let key = jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes())
        .map_err(|err| err.to_string())?;

    let crab = octocrab::Octocrab::builder()
        .app(octocrab::models::AppId(app_id), key)
        .build()
        .unwrap()
        .installation(octocrab::models::InstallationId(installation_id));

    Ok(crab)
}
