use std::io::Write;

/// Opens a temp file for editing, waits until the file is closed and returns content of the file
/// This function spawns a new process (open file) and wait until the process is finished.
#[tauri::command]
pub async fn open_in_editor(
    handle: tauri::AppHandle,
    file_name: String,
    content: String,
) -> Result<String, &'static str> {
    log::trace!("Getting path to temp file directory");
    let path = match crate::paths::get_temp_path(handle) {
        Ok(temp_dir) => temp_dir.join(file_name),
        Err(err) => {
            log::error!(
                "Error found while trying to get temp file directory: {}",
                err
            );
            return Err("Failed to get temp file directory");
        }
    };

    log::trace!("Creating temp file");
    let mut file = match std::fs::File::create(&temp_file_path) {
        Ok(file) => file,
        Err(err) => {
            log::error!("Error found while trying to create temp file: {}", err);
            return Err("Failed to create temp file");
        }
    };
    log::trace!("Writing initial content to temp file");
    match file.write_all(content.as_bytes()) {
        Ok(()) => (),
        Err(err) => {
            log::error!(
                "Error found while trying to write initial content to temp file: {}",
                err
            );
            return Err("Failed to write initial content to temp file");
        }
    };

    // Open file with vscode on windows
    // everything else is unimplemented
    let _status = if cfg!(target_os = "windows") {
        let mut proc = std::process::Command::new("cmd")
            .arg("/C")
            .arg("code")
            .arg("-w")
            .arg("-n")
            .arg(&temp_file_path)
            .spawn();

        log::trace!("Waiting for subprocess to finish");
        match proc {
            Ok(subproc) => match subproc.wait() {
                Ok(status) => status,
                Err(err) => {
                    log::error!("Error found while trying to wait for subprocess: {}", err);
                    return Err("Failed to wait for subprocess");
                }
            },
            Err(err) => {
                log::error!("Error found while trying to spawn subprocess: {}", err);
                return Err("Failed to spawn subprocess for opening editor");
            }
        };
    } else {
        unimplemented!()
    };

    log::trace!("Reading content from temp file");
    let updated_content = match std::fs::read_to_string(&temp_file_path) {
        Ok(content) => content,
        Err(err) => {
            log::error!(
                "Error found while trying to read content from temp file: {}",
                err
            );
            return Err("Failed to read content from temp file");
        }
    };

    log::trace!("Removing temp file");
    match std::fs::remove_file(&temp_file_path) {
        Ok(_) => (),
        Err(err) => {
            log::error!("Error found while trying to remove temp file: {}", err);
            return Err("Failed to remove temp file");
        }
    };

    Ok(updated_content)
}
