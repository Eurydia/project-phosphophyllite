use std::io::Write;

/// Opens target path.
///
/// This function captures code duplication in other functions of this crate.
///
/// # Error
/// - [`opener`] cannot open path
fn open_path(path: std::path::PathBuf) -> Result<(), &'static str> {
    match opener::open(&path) {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!(
                "opener cannot open path \"{}\": \"{}\"",
                &path.display(),
                err
            );
            Err("Cannot open path")
        }
    }
}

/// Opens the secret directory.
///
/// This command is a wrapper around [`open_path`] that opens the secret directory.
#[tauri::command]
pub fn open_secret_dir(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = crate::paths::get_secret_dir(handle)?;
    open_path(path)
}

/// Opens the database directory.
///
/// This command is a wrapper around [`open_path`] that opens the database directory.
#[tauri::command]
pub fn open_setting_file(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = crate::paths::get_setting_dir(handle)?;
    open_path(path)
}

/// Opens the log directory.
///
/// This command is a wrapper around [`open_path`] that opens the log directory.
#[tauri::command]
pub fn open_log_dir(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = crate::paths::get_log_dir(handle)?;
    open_path(path)
}

/// Opens the database directory.
///
/// This command is a wrapper around [`open_path`] that opens the database directory.
#[tauri::command]
pub fn open_href(href: String) -> Result<(), &'static str> {
    match opener::open_browser(&href) {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!("opener cannot open link \"{}\": \"{}\"", &href, err);
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
        Ok(()) => (),
        Err(err) => {
            log::error!("System cannot write content: \"{}\"", err);
            return Err("Cannot write content");
        }
    };

    // Open file with vscode on windows
    // everything else is unimplemented
    if cfg!(target_os = "windows") {
        let cmd = std::process::Command::new("cmd")
            .arg("/C")
            .arg("code")
            .arg("-w")
            .arg("-n")
            .arg(&file_path)
            .spawn();

        match cmd {
            Ok(mut subproc) => match subproc.wait() {
                Ok(status) => status,
                Err(err) => {
                    log::error!("System cannot wait for subprocess: \"{}\"", err);
                    return Err("Cannot wait for subprocess");
                }
            },
            Err(err) => {
                log::error!("System cannot spawn subprocess: \"{}\"", err);
                return Err("Cannot spawn subprocess");
            }
        };
    } else {
        unimplemented!()
    };

    let updated_content = match std::fs::read_to_string(&file_path) {
        Ok(content) => content,
        Err(err) => {
            log::error!("System cannot read content: \"{}\"", err);
            return Err("Cannot read content");
        }
    };

    match std::fs::remove_file(&file_path) {
        Ok(_) => (),
        Err(err) => {
            log::error!("System cannot remove file: \"{}\"", err);
            return Err("Cannot remove file");
        }
    };

    Ok(updated_content)
}
