pub fn get_octocrab(handle: tauri::AppHandle) -> octocrab::Octocrab {
    let app_id = crate::secrets::get_app_id(&handle).parse::<u64>().unwrap();
    let rsa_private_key = crate::secrets::get_rsa_private_key(&handle);
    let installation_id = crate::secrets::get_installation_id(&handle)
        .parse::<u64>()
        .unwrap();

    let key = jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes()).unwrap();

    octocrab::Octocrab::builder()
        .app(octocrab::models::AppId(app_id), key)
        .build()
        .unwrap()
        .installation(octocrab::models::InstallationId(installation_id))
}
