use std::io::Write;

// Opens a temp file for editing, waits until the file is closed and returns content of the file
// This function spawns a new process (open file) and wait until the process is finished.
#[tauri::command]
pub async fn open_in_editor(
    handle: tauri::AppHandle,
    file_name: String,
    content: String,
) -> Result<String, String> {
    let temp_dir = crate::paths::get_temp_path(&handle)?;
    let temp_file_path = temp_dir.join(file_name);

    // Write the initial content to the temporary file
    let mut file = std::fs::File::create(&temp_file_path)
        .map_err(|_| String::from("Failed to create temp file"))?;
    file.write_all(content.as_bytes())
        .map_err(|_| String::from("Failed to write initial content to temp file"))?;

    // Open file with vscode on windows
    // everything else is unimplemented
    let _status = if cfg!(target_os = "windows") {
        let mut proc = std::process::Command::new("cmd")
            .arg("/C")
            .arg("code")
            .arg("-w")
            .arg("-n")
            .arg(&temp_file_path)
            .spawn()
            .map_err(|_| String::from("Failed to spawn subprocess for opening editor"))?;

        proc.wait()
            .map_err(|_| String::from("Failed to wait for subprocess"))?;
    } else {
        unimplemented!()
    };

    let updated_content = std::fs::read_to_string(&temp_file_path)
        .map_err(|_| String::from("Failed to read content from temp file"))?;

    std::fs::remove_file(&temp_file_path)
        .map_err(|_| String::from("Failed to remove temp file"))?;

    Ok(updated_content)
}
