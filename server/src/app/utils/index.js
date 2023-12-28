const fse = require('fs-extra')

async function getUploadedList(dirPath) {
  return fse.existsSync(dirPath) ? (await fse.readdir(dirPath)).filter((name) => name[0] !== '.') : []
}

module.exports = {
  getUploadedList
}
