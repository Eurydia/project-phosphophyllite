use std::io::Write;

fn open_path(path: std::path::PathBuf) -> Result<(), &'static str> {
    match opener::open(path) {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!("Cannot open path: {}", err);
            Err("Cannot open path")
        }
    }
}

#[tauri::command]
pub fn open_secret_dir(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = crate::paths::get_secret_dir(handle)?;
    log::trace!("Opening secret");
    open_path(path)
}

#[tauri::command]
pub fn open_setting_file(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = crate::paths::get_setting_dir(handle)?;
    log::trace!("Opening setting");
    open_path(path)
}

#[tauri::command]
pub fn open_log_dir(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = crate::paths::get_log_dir(handle)?;
    log::trace!("Opening log");
    open_path(path)
}

#[tauri::command]
pub fn open_href(href: String) -> Result<(), &'static str> {
    log::trace!("Opening link: {}", href);
    match opener::open_browser(href) {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!("Cannot open link: {}", err);
            Err("Cannot open link")
        }
    }
}

/// Opens a temp file for editing, waits until the file is closed and returns content of the file
/// This function spawns a new process (open file) and wait until the process is finished.
///
/// Also, cannot use "tempfile" for this featture since the file seems to be closed before its content can be read?
#[tauri::command]
pub async fn open_in_editor(
    handle: tauri::AppHandle,
    file_name: String,
    content: String,
) -> Result<String, &'static str> {
    let dir_path = crate::paths::get_temp_dir(handle)?;
    let file_path = dir_path.join(file_name);

    log::trace!("Creating temp file");
    let mut file = match std::fs::File::create(&file_path) {
        Ok(file) => file,
        Err(err) => {
            log::error!("Cannot create temp file: {}", err);
            return Err("Cannot create temp file");
        }
    };

    log::trace!("Writing initial content");
    match file.write_all(content.as_bytes()) {
        Ok(()) => (),
        Err(err) => {
            log::error!("Cannot write content: {}", err);
            return Err("Cannot write content");
        }
    };

    // Open file with vscode on windows
    // everything else is unimplemented
    log::trace!("Spawning subprocess");
    if cfg!(target_os = "windows") {
        let cmd = std::process::Command::new("cmd")
            .arg("/C")
            .arg("code")
            .arg("-w")
            .arg("-n")
            .arg(&file_path)
            .spawn();

        log::trace!("Waiting for subprocess");
        match cmd {
            Ok(mut subproc) => match subproc.wait() {
                Ok(status) => status,
                Err(err) => {
                    log::error!("Cannot wait for subprocess: {}", err);
                    return Err("Cannot wait for subprocess");
                }
            },
            Err(err) => {
                log::error!("Cannot spawn subprocess: {}", err);
                return Err("Cannot spawn subprocess");
            }
        };
    } else {
        unimplemented!()
    };

    log::trace!("Reading edited content");
    let updated_content = match std::fs::read_to_string(&file_path) {
        Ok(content) => content,
        Err(err) => {
            log::error!("Cannot read content: {}", err);
            return Err("Cannot read content");
        }
    };

    log::trace!("Removing temp file");
    match std::fs::remove_file(&file_path) {
        Ok(_) => (),
        Err(err) => {
            log::error!("Cannot remove file: {}", err);
            return Err("Cannot remove file");
        }
    };

    Ok(updated_content)
}
