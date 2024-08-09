use std::io::Write;

#[tauri::command(rename_all = "camelCase")]
pub fn create_temp_file(
    handle: tauri::AppHandle,
    file_name: String,
    content: String,
) -> Result<std::path::PathBuf, &'static str> {
    let dir_path = crate::paths::get_temp_dir(&handle)?;
    let file_path = dir_path.join(file_name);

    let mut file = match std::fs::File::create(&file_path) {
        Ok(file) => file,
        Err(err) => {
            log::error!(
                "System cannot create temp file at \"{}\": \"{}\"",
                &file_path.display(),
                err
            );
            return Err("Cannot create file");
        }
    };

    match file.write_all(content.as_bytes()) {
        Ok(()) => Ok(file_path),
        Err(err) => {
            log::error!("System cannot write content: \"{}\"", err);
            Err("Cannot write content")
        }
    }
}

#[tauri::command(rename_all = "camelCase")]
pub fn delete_temp_file(handle: tauri::AppHandle, file_name: String) -> Result<(), &'static str> {
    let dir_path = crate::paths::get_temp_dir(&handle)?;
    let file_path = dir_path.join(file_name);

    match std::fs::remove_file(&file_path) {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!(
                "System cannot remove temp file at \"{}\": \"{}\"",
                &file_path.display(),
                err
            );
            Err("Cannot remove file")
        }
    }
}
