use std::io::Write;

#[tauri::command]
// Opens a temp file for editing, waits until the file is closed and returns content of the file
// This function spawns a new process (open file) and wait until the process is finished.
pub async fn open_in_editor(
    handle: tauri::AppHandle,
    file_name: String,
    content: String,
) -> Result<String, String> {
    let temp_dir = crate::paths::get_temp_path(&handle)?;
    let temp_file_path = temp_dir.join(file_name);

    // Write the initial content to the temporary file
    {
        let mut file = std::fs::File::create(&temp_file_path).unwrap();
        file.write_all(content.as_bytes()).unwrap();
    }

    // Open the default editor based on the operating system and wait for it to close
    let _status = if cfg!(target_os = "windows") {
        let mut proc = std::process::Command::new("cmd")
            .arg("/C")
            .arg("code")
            .arg("-wn")
            .arg(&temp_file_path)
            .spawn()
            .map_err(|err| err.to_string())?;
        proc.wait().map_err(|err| err.to_string())?
    } else {
        unimplemented!()
    };

    let updated_content =
        std::fs::read_to_string(&temp_file_path).map_err(|err| err.to_string())?;

    Ok(updated_content)
}
