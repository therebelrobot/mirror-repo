function createTarget (opts) {
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
      name: opts.target.repo
    }
    if (opts.target.username !== opts.target.account) {
      msg.org = opts.target.account
      gh.repos.createFromOrg(msg, createCallback)
    } else {
      gh.repos.create(msg, createCallback)
    }
    function createCallback (err, data) {
      if (err) reject(err)
      resolve(data)
    }
  })
}
module.exports = createTarget
