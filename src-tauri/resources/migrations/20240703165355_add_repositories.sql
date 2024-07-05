-- {
--   "name": "Hello-World",
--   "full_name": "octocat/Hello-World",
--   "owner": {
--     "login": "octocat",
--   "private": false,
--   "html_url": "https://github.com/octocat/Hello-World",
--   "description": "This your first repo!",
--   "url": "https://api.github.com/repos/octocat/Hello-World",
--   "archived": false,
--   "disabled": false,
--   "visibility": "public",
--   "pushed_at": "2011-01-26T19:06:43Z",
--   "created_at": "2011-01-26T19:01:12Z",
--   "updated_at": "2011-01-26T19:14:43Z",
-- }

-- Schema source: https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository

CREATE TABLE IF NOT EXISTS repositories (
    "url" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "owner_login" TEXT NOT NULL,
    "pushed_at" TEXT,
    "created_at" TEXT,
    "updated_at" TEXT,
    "private" INT NOT NULL,
    "archived" INT NOT NULL,
    "visibility" TEXT,
    "html_url" TEXT NOT NULL,
    "description" TEXT,
    "readme" TEXT
);