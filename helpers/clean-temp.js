var fs = require('fs')

function cleanTemp (opts) {
  return new Promise(function (resolve, reject) {
    // delete the temp folder
    // attempt at sync
    deleteFolderRecursive(opts.tmpPath)
    if (opts.tmpCreated) {
      deleteFolderRecursive(opts.tempFolder)
    }
    resolve()

  // //attempt at async
  // deleteFolderRecursiveAsync(opts.tmpPath, function (err,data){
  //   if(err) reject(err)
  //   resolve(data)
  // })
  })
}

module.exports = cleanTemp

// helper function for removing a folder. http://www.geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
function deleteFolderRecursive (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
function deleteFolderRecursiveAsync (path, callback) {
  fs.readdir(path, function (err, files) {
    if (err) {
      // Pass the error on to callback
      callback(err, [])
      return
    }
    var wait = files.length
    var count = 0
    var folderDone = function (err) {
      count++
      // If we cleaned out all the files, continue
      if (count >= wait || err) {
        fs.rmdir(path, callback)
      }
    }
    // Empty directory to bail early
    if (!wait) {
      folderDone()
      return
    }

    // Remove one or more trailing slash to keep from doubling up
    path = path.replace(/\/+$/, '')
    files.forEach(function (file) {
      var curPath = path + '/' + file
      fs.lstat(curPath, function (err, stats) {
        if (err) {
          callback(err, [])
          return
        }
        if (stats.isDirectory()) {
          deleteFolderRecursiveAsync(curPath, folderDone)
        } else {
          fs.unlink(curPath, folderDone)
        }
      })
    })
  })
}
