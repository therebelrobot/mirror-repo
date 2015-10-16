var _ = require('lodash')
var gh = require("github")

var ManualFork = {
  fork: function(opts){
    /*
      opts: {
        source,
        target,
        token,
        tempFolder,
        ghOpts: {}
      }
    */
    // create target on Github
    createTarget({
      token:opts.token,
      target:opts.target,
      ghOpts: opts.ghOpts
    })
    // clone repo from source to a temp folder

    // change git origin to target

    // push temp folder to target

    // clean up temp
  }
}

module.exports = ManualFork

function createTarget (opts){
  gh.authenticate({
    type: "token",
    token: opts.token
  })
}
