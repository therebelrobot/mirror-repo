function checkCommits (opts) {
  return new Promise(function (resolve, reject) {
    var gh = opts.gh
    if (opts.target.oauth) {
      gh.authenticate({
        type: 'oauth',
        token: opts.target.token
      })
    } else {
      gh.authenticate({
        type: 'token',
        token: opts.target.token
      })
    }
    var msg = {
      repo: opts.target.repo
    }
    msg.user = opts.target.account
    gh.repos.getCommits(msg, createCallback)
    function createCallback (err, data) {
      if (err) reject(err)
      resolve(data)
    }
  })
}
module.exports = checkCommits
