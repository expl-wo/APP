const UniModuleRouter = require("@ctrlc/uni-module-pages");
const uniRouter = new UniModuleRouter({
  // 项目定义的路由目录
  dir: "./router",
  // uni_modules插件路由文件,
});

module.exports = (pagesJson, loader) => {
  return uniRouter.loader(pagesJson, loader);
};