const Koa = require("koa");
const KoaRouter = require("koa-router");
const requireDirectory = require("require-directory");

class App {
  static port = 3000;
  static app;
  static initApp() {
    const app = new Koa();
    app.listen(App.port, () => {
      console.log(`
      服务器已启动请访问：http://localhost:${App.port}
      `);
    });
    App.app = app;
  }

  static autoInitRouter() {
    const routerDir = `${process.cwd()}/src/app/v1`;
    requireDirectory(module, routerDir, {
      visit: (router) => {
        router instanceof KoaRouter && App.app.use(router.routes());
      },
    });
  }
}

module.exports = App;
