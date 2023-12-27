const KoaRouter = require("koa-router");

const largeFileUpload = new KoaRouter();

largeFileUpload.get("/", (ctx) => {
  ctx.body = "大文件上传";
});

module.exports = largeFileUpload;
