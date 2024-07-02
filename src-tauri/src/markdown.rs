#[tauri::command]
pub fn parse_markdown(_handler: tauri::AppHandle, markdown_string: &str) -> String {
    markdown::to_html_with_options(markdown_string, &markdown::Options::gfm()).unwrap()
}
