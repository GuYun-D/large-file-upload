const { resolve } = require('path')
const fse = require('fs-extra')
const KoaRouter = require('koa-router')
const {
  largeFileLoadConfig: { saveDir }
} = require('../../config')
const { getUploadedList } = require('../utils')
const largeFileUploadRouter = new KoaRouter()

largeFileUploadRouter.get('/', (ctx) => {
  ctx.body = '大文件上传'
})

/**
 * 检查是否已经上传了该文件
 */
largeFileUploadRouter.post('/checkFileExist', async (ctx) => {
  const body = ctx.request.body
  const { ext, hash } = body
  if (!hash) {
    return (ctx.body = {
      status: 0,
      message: '请传入文件hash值',
      data: null
    })
  }

  const filePath = resolve(saveDir, `${hash}.${ext}`)
  let uploaded = false
  let uploadList = []

  if (fse.existsSync(filePath)) {
    uploaded = true
  } else {
    uploadList = await getUploadedList(resolve(saveDir, `${hash}`))
  }

  ctx.body = {
    status: 1,
    message: '',
    data: {
      upload: uploaded,
      uploadList
    }
  }
})

largeFileUploadRouter.post('/uploadfile', async (ctx) => {
  const body = ctx.request.body
  const { hash, name } = body
  const file = ctx.request.files.chunk

  const chunkPath = resolve(saveDir, hash)
  if (!fse.existsSync(chunkPath)) {
    await fse.mkdir(chunkPath)
  }
  await fse.move(file.filepath, `${chunkPath}/${name}`)
  ctx.body = {
    status: 1,
    mesaage: '切片上传成功',
    data: null
  }
})

largeFileUploadRouter.post('/mergeFile', async (ctx) => {
  const body = ctx.request.body
  const { size, ext, hash } = body
  const fileFinalPath = resolve(saveDir, `${hash}.${ext}`)
  const chunkDir = resolve(saveDir, hash)
  // 将所有chunk读取出来
  let chunks = await fse.readdir(chunkDir)
  // 将chunk进行排序
  chunks = chunks.sort((a, b) => {
    return a.split('-')[1] - b.split('-')[1]
  })
  chunks = chunks.map((path) => resolve(chunkDir, path))

  const pipStream = (filePath, writeStream) => {
    return new Promise((resolve, reject) => {
      const readStream = fse.createReadStream(filePath)
      readStream.on('end', () => {
        fse.unlinkSync(filePath)
        resolve()
      })
      readStream.pipe(writeStream)
    })
  }

  const pips = chunks.map((file, index) => {
    return pipStream(
      file,
      fse.createWriteStream(fileFinalPath, {
        start: index * size,
        end: (index + 1) * size
      })
    )
  })

  try {
    await Promise.all(pips)
    ctx.body = {
      status: 1,
      message: '合并成功',
      data: `/public/${hash}.${ext}`
    }
  } catch (error) {
    ctx.body = {
      status: 1,
      message: '合并失败',
      data: error
    }
  }
})

module.exports = largeFileUploadRouter
