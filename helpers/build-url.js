function buildUrl (username, token, host, account, repo) {
  return 'https://' + username + ':' + token + '@' + host + '/' + account + '/' + repo + '.git'
}
module.exports = buildUrl
