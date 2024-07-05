-- {
--   "url": "https://api.github.com/repos/octocat/Hello-World/issues/1347",
--   "repository_url": "https://api.github.com/repos/octocat/Hello-World",
--   "html_url": "https://github.com/octocat/Hello-World/issues/1347",
--   "number": 1347,
--   "state": "open",
--   "title": "Found a bug",
--   "body": "I'm having a problem with this.",
--   "user": {
--     "type": "User",
--   },
--   "closed_at": null,
--   "created_at": "2011-04-22T13:33:48Z",
--   "updated_at": "2011-04-22T13:33:48Z",
-- }


-- Schema source: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue
CREATE TABLE IF NOT EXISTS issues (
    "url" TEXT PRIMARY KEY,
    
    "repository_url"  TEXT NOT NULL, -- Secondary key

    "title" TEXT NOT NULL,
    "body" TEXT,
    "state" TEXT NOT NULL,
    "number" BIGINT NOT NULL,
    "html_url" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "closed_at" TEXT,


    "user_type" TEXT NOT NULL
);
