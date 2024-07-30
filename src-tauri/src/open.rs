macro_rules! open_path {
    ($path:expr) => {{
        match opener::open(path) {
            Ok(_) => Ok(()),
            Err(err) => {
                log::error!("Opener failed to open path: {}", err);
                Err("Something went wrong while trying to open path")
            }
        }
    }};
}

#[tauri::command]
pub fn open_secret_dir(handle: tauri::AppHandle) -> Result<(), &'static str> {
    log::trace!("Opening secret");
    let path = crate::paths::get_secret_path(handle)?;
    open_path!(path)
}

#[tauri::command]
pub fn open_setting_file(handle: tauri::AppHandle) -> Result<(), &'static str> {
    log::trace!("Opening setting");
    let path = crate::paths::get_setting_path(handle)?;
    open_path!(path)
}

#[tauri::command]
pub fn open_log_dir(handle: tauri::AppHandle) -> Result<(), &'static str> {
    log::trace!("Opening log");
    let path = crate::paths::get_log_path(handle)?;
    open_path!(path)
}

#[tauri::command]
pub fn open_href(href: String) -> Result<(), &'static str> {
    log::trace!("Opening link: {}", href);
    match opener::open_browser(href) {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!("Openner failed to open link: {}", err);
            Err("Something went wrong while trying to open link")
        }
    }
}
