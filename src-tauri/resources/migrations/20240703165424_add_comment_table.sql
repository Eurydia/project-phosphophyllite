-- {
--   "id": 1,
--   "url": "https://api.github.com/repos/octocat/Hello-World/issues/comments/1",
--   "html_url": "https://github.com/octocat/Hello-World/issues/1347#issuecomment-1",
--   "body": "Me too",
--   "created_at": "2011-04-14T16:00:49Z",
--   "updated_at": "2011-04-14T16:00:49Z",
--   "issue_url": "https://api.github.com/repos/octocat/Hello-World/issues/1347",
-- }

-- Schema source: https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#get-an-issue-comment
CREATE TABLE IF NOT EXISTS comments (
    -- unique by nature
    "url" TEXT PRIMARY KEY,
    -- secondary key.
    issue_url TEXT NOT NULL,


    id BIGINT,
    body TEXT,
    html_url TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
