#[tauri::command]
pub async fn put_repository_readme(
    handle: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    owner_name: String,
    repository_name: String,
    content: String,
) -> Result<bool, String> {
    let octocrab = state.octocrab.repos(owner_name, repository_name);
    let sha = octocrab.get_readme().send().await.unwrap().sha;

    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
    let put_req = octocrab
        .update_file(
            "readme.md",
            "updated readme via Phosphophyllite",
            content,
            sha,
        )
        .send()
        .await
        .unwrap();

    Ok(false)
}

// {
//   "content": {
//     "name": "hello.txt",
//     "path": "notes/hello.txt",
//     "sha": "95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
//     "size": 9,
//     "url": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
//     "html_url": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt",
//     "git_url": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
//     "download_url": "https://raw.githubusercontent.com/octocat/HelloWorld/master/notes/hello.txt",
//     "type": "file",
//     "_links": {
//       "self": "https://api.github.com/repos/octocat/Hello-World/contents/notes/hello.txt",
//       "git": "https://api.github.com/repos/octocat/Hello-World/git/blobs/95b966ae1c166bd92f8ae7d1c313e738c731dfc3",
//       "html": "https://github.com/octocat/Hello-World/blob/master/notes/hello.txt"
//     }
//   },
//   "commit": {
//     "sha": "7638417db6d59f3c431d3e1f261cc637155684cd",
//     "node_id": "MDY6Q29tbWl0NzYzODQxN2RiNmQ1OWYzYzQzMWQzZTFmMjYxY2M2MzcxNTU2ODRjZA==",
//     "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/7638417db6d59f3c431d3e1f261cc637155684cd",
//     "html_url": "https://github.com/octocat/Hello-World/git/commit/7638417db6d59f3c431d3e1f261cc637155684cd",
//     "author": {
//       "date": "2014-11-07T22:01:45Z",
//       "name": "Monalisa Octocat",
//       "email": "octocat@github.com"
//     },
//     "committer": {
//       "date": "2014-11-07T22:01:45Z",
//       "name": "Monalisa Octocat",
//       "email": "octocat@github.com"
//     },
//     "message": "my commit message",
//     "tree": {
//       "url": "https://api.github.com/repos/octocat/Hello-World/git/trees/691272480426f78a0138979dd3ce63b77f706feb",
//       "sha": "691272480426f78a0138979dd3ce63b77f706feb"
//     },
//     "parents": [
//       {
//         "url": "https://api.github.com/repos/octocat/Hello-World/git/commits/1acc419d4d6a9ce985db7be48c6349a0475975b5",
//         "html_url": "https://github.com/octocat/Hello-World/git/commit/1acc419d4d6a9ce985db7be48c6349a0475975b5",
//         "sha": "1acc419d4d6a9ce985db7be48c6349a0475975b5"
//       }
//     ],
//     "verification": {
//       "verified": false,
//       "reason": "unsigned",
//       "signature": null,
//       "payload": null
//     }
//   }
// }

// {
//   "type": "file",
//   "encoding": "base64",
//   "size": 5362,
//   "name": "README.md",
//   "path": "README.md",
//   "content": "IyBZb2dhIEJvmsgaW4gcHJvZ3Jlc3MhIEZlZWwgdAoKOndhcm5pbmc6IFdvc\\nZnJlZSBmUgdG8gY0byBjaGVjayBvdXQgdGhlIGFwcCwgYnV0IGJlIHN1c29t\\nZSBiYWNrIG9uY2UgaXQgaXMgY29tcGxldGUuCgpBIHdlYiBhcHAgdGhhdCBs\\nZWFkcyB5b3UgdGhyb3VnaCBhIHlvZ2Egc2Vzc2lvbi4KCltXb3Jrb3V0IG5v\\ndyFdKGh0dHBzOi8vc2tlZHdhcmRzODguZ2l0aHViLmlvL3lvZ2EvKQoKPGlt\\nZyBzcmM9InNyYy9pbWFnZXMvbWFza2FibGVfaWNvbl81MTIucG5nIiBhbHQ9\\nImJvdCBsaWZ0aW5nIHdlaWdodHMiIHdpZHRoPSIxMDAiLz4KCkRvIHlvdSBo\\nYXZlIGZlZWRiYWNrIG9yIGlkZWFzIGZvciBpbXByb3ZlbWVudD8gW09wZW4g\\nYW4gaXNzdWVdKGh0dHBzOi8vZ2l0aHViLmNvbS9za2Vkd2FyZHM4OC95b2dh\\nL2lzc3Vlcy9uZXcpLgoKV2FudCBtb3JlIGdhbWVzPyBWaXNpdCBbQ25TIEdh\\nbWVzXShodHRwczovL3NrZWR3YXJkczg4LmdpdGh1Yi5pby9wb3J0Zm9saW8v\\nKS4KCiMjIERldmVsb3BtZW50CgpUbyBhZGQgYSBuZXcgcG9zZSwgYWRkIGFu\\nIGVudHJ5IHRvIHRoZSByZWxldmFudCBmaWxlIGluIGBzcmMvYXNhbmFzYC4K\\nClRvIGJ1aWxkLCBydW4gYG5wbSBydW4gYnVpbGRgLgoKVG8gcnVuIGxvY2Fs\\nbHkgd2l0aCBsaXZlIHJlbG9hZGluZyBhbmQgbm8gc2VydmljZSB3b3JrZXIs\\nIHJ1biBgbnBtIHJ1biBkZXZgLiAoSWYgYSBzZXJ2aWNlIHdvcmtlciB3YXMg\\ncHJldmlvdXNseSByZWdpc3RlcmVkLCB5b3UgY2FuIHVucmVnaXN0ZXIgaXQg\\naW4gY2hyb21lIGRldmVsb3BlciB0b29sczogYEFwcGxpY2F0aW9uYCA+IGBT\\nZXJ2aWNlIHdvcmtlcnNgID4gYFVucmVnaXN0ZXJgLikKClRvIHJ1biBsb2Nh\\nbGx5IGFuZCByZWdpc3RlciB0aGUgc2VydmljZSB3b3JrZXIsIHJ1biBgbnBt\\nIHN0YXJ0YC4KClRvIGRlcGxveSwgcHVzaCB0byBgbWFpbmAgb3IgbWFudWFs\\nbHkgdHJpZ2dlciB0aGUgYC5naXRodWIvd29ya2Zsb3dzL2RlcGxveS55bWxg\\nIHdvcmtmbG93Lgo=\\n",
//   "sha": "3d21ec53a331a6f037a91c368710b99387d012c1",
//   "url": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
//   "git_url": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
//   "html_url": "https://github.com/octokit/octokit.rb/blob/master/README.md",
//   "download_url": "https://raw.githubusercontent.com/octokit/octokit.rb/master/README.md",
//   "_links": {
//     "git": "https://api.github.com/repos/octokit/octokit.rb/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1",
//     "self": "https://api.github.com/repos/octokit/octokit.rb/contents/README.md",
//     "html": "https://github.com/octokit/octokit.rb/blob/master/README.md"
//   }
// }
