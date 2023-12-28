const Koa = require('koa')
const KoaRouter = require('koa-router')
const { koaBody } = require('koa-body')
const requireDirectory = require('require-directory')

class App {
  static port = 3000
  static app
  static initApp() {
    const app = new Koa()
    app.listen(App.port, () => {
      console.log(`
      服务器已启动请访问：http://localhost:${App.port}
      `)
    })
    app.use(
      koaBody({
        multipart: true
      })
    )

    app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', '*')
      ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
      ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
      if (ctx.method == 'OPTIONS') {
        ctx.body = 200
      } else {
        await next()
      }
    })
    App.app = app
  }

  static autoInitRouter() {
    const routerDir = `${process.cwd()}/src/app/v1`
    requireDirectory(module, routerDir, {
      visit: (router) => {
        router instanceof KoaRouter && App.app.use(router.routes())
      }
    })
  }
}

module.exports = App
