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
      try {
        err = JSON.parse(err.toString())
      }
      catch (err) {
        //not json and can't parse
      }

      if (err && err.message !== 'Git Repository is empty.') {
        reject(err)
      }
      data = data || []
      resolve(data)
    }
  })
}
module.exports = checkCommits
