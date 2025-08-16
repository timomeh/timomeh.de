# GitHub Private Repo Content Reverse Proxy

Reverse Proxy to read a file in a private github repo. Should never be public to the internet!

## Details

- A GitHub URL like https://raw.githubusercontent/main/owner/repo/some/file.png is the GitHub URL that is only accessible with a GitHub Token as authorization header
- This service makes this file available under /raw-content/some/file.png

## Config

- `PORT` the port on which this thing runs
- `GH_REPO` the private GitHub Repo to proxy, in format `owner/name`, e.g. `timomeh/timomeh.de-content`
- `GH_TOKEN` a token that has read access to those files.
