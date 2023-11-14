
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/main/main","pages/andon/index","pages/equip/index","pages/equip/equipCheck/index","pages/equip/equipCheck/dailyCheck","pages/equip/equipCheck/specialityCheck","pages/equip/equipCheck/checkItem","pages/equip/equipMaintenance/index","pages/equip/equipMaintenance/maintenanceTask","pages/equip/equipMaintenance/maintenanceOperation","pages/equip/equipMaintenance/maintenanceApply","pages/equip/equipRepair/index","pages/equip/equipRepair/reportManager/index","pages/equip/equipRepair/reportManager/equipReport","pages/equip/equipRepair/reportManager/orderReport","pages/equip/equipRepair/reportManager/ensure","pages/equip/equipRepair/repairManager/index","pages/equip/equipRepair/repairManager/response","pages/equip/equipRepair/repairManager/operation","pages/production/index","pages/production/opTask/selectWorkSpace","pages/production/opTask/selectPosition","pages/production/opTask/index","pages/production/opTask/opReport","pages/production/opTask/opCheck","pages/production/opTask/opMaterial","pages/production/opTask/andon","pages/production/opTask/checkMaterial","pages/production/opTask/opBom","pages/production/resistanceTrim/resistanceTrim","pages/production/resistanceTrim/trimManage","pages/production/opTask/opMaterial","pages/quality/index","pages/quality/check","pages/login/login","pages/user/message","pages/user/user"],"window":{"navigationStyle":"default","navigationBarTextStyle":"black","navigationBarBackgroundColor":"#fff","backgroundColor":"#f4f4ef","rpxCalcMaxDeviceWidth":99999,"rpxCalcBaseDeviceWidth":99999,"rpxCalcIncludeWidth":99999},"tabBar":{"color":"#7d7e74","selectedColor":"#000000","backgroundColor":"#ffffff","fontSize":"30px","spacing":"0px","height":"80px","list":[{"pagePath":"pages/main/main","text":"首页","iconPath":"static/img/home.png","selectedIconPath":"static/img/homeHL.png"},{"pagePath":"pages/user/user","text":"我的","iconPath":"static/img/user.png","selectedIconPath":"static/img/userHL.png"}]},"darkmode":false,"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"HB_DQ_MES","compilerVersion":"3.8.12","entryPagePath":"pages/main/main","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/main/main","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"MES首页","titleNView":{"autoBackButton":false}}},{"path":"/pages/andon/index","meta":{},"window":{"navigationBarTitleText":"安灯","titleNView":true}},{"path":"/pages/equip/index","meta":{},"window":{"navigationBarTitleText":"设备管理","titleNView":true}},{"path":"/pages/equip/equipCheck/index","meta":{},"window":{"navigationBarTitleText":"设备点检","titleNView":true}},{"path":"/pages/equip/equipCheck/dailyCheck","meta":{},"window":{"navigationBarTitleText":"日常点检","titleNView":true}},{"path":"/pages/equip/equipCheck/specialityCheck","meta":{},"window":{"navigationBarTitleText":"专业点检","titleNView":true}},{"path":"/pages/equip/equipCheck/checkItem","meta":{},"window":{"navigationBarTitleText":"点检项","titleNView":true}},{"path":"/pages/equip/equipMaintenance/index","meta":{},"window":{"navigationBarTitleText":"设备保养","titleNView":true}},{"path":"/pages/equip/equipMaintenance/maintenanceTask","meta":{},"window":{"navigationBarTitleText":"保养任务","titleNView":true}},{"path":"/pages/equip/equipMaintenance/maintenanceOperation","meta":{},"window":{"navigationBarTitleText":"保养操作","titleNView":true}},{"path":"/pages/equip/equipMaintenance/maintenanceApply","meta":{},"window":{"navigationBarTitleText":"保养验收","titleNView":true}},{"path":"/pages/equip/equipRepair/index","meta":{},"window":{"navigationBarTitleText":"设备维修","titleNView":true}},{"path":"/pages/equip/equipRepair/reportManager/index","meta":{},"window":{"navigationBarTitleText":"报修管理","titleNView":true}},{"path":"/pages/equip/equipRepair/reportManager/equipReport","meta":{},"window":{"navigationBarTitleText":"设备报修","titleNView":true}},{"path":"/pages/equip/equipRepair/reportManager/orderReport","meta":{},"window":{"navigationBarTitleText":"维修预约","titleNView":true}},{"path":"/pages/equip/equipRepair/reportManager/ensure","meta":{},"window":{"navigationBarTitleText":"维修确认","titleNView":true}},{"path":"/pages/equip/equipRepair/repairManager/index","meta":{},"window":{"navigationBarTitleText":"维修管理","titleNView":true}},{"path":"/pages/equip/equipRepair/repairManager/response","meta":{},"window":{"navigationBarTitleText":"维修响应","titleNView":true}},{"path":"/pages/equip/equipRepair/repairManager/operation","meta":{},"window":{"navigationBarTitleText":"维修操作","titleNView":true}},{"path":"/pages/production/index","meta":{},"window":{"navigationBarTitleText":"生产管理","titleNView":true}},{"path":"/pages/production/opTask/selectWorkSpace","meta":{},"window":{"navigationBarTitleText":"工位选择","titleNView":true}},{"path":"/pages/production/opTask/selectPosition","meta":{},"window":{"navigationBarTitleText":"工位实列","titleNView":true}},{"path":"/pages/production/opTask/index","meta":{},"window":{"navigationBarTitleText":"生产任务","titleNView":true}},{"path":"/pages/production/opTask/opReport","meta":{},"window":{"navigationBarTitleText":"生产报工","titleNView":true}},{"path":"/pages/production/opTask/opCheck","meta":{},"window":{"navigationBarTitleText":"生产质检","titleNView":true}},{"path":"/pages/production/opTask/opMaterial","meta":{},"window":{"navigationBarTitleText":"部件登记","titleNView":true}},{"path":"/pages/production/opTask/andon","meta":{},"window":{"navigationBarTitleText":"Andon","titleNView":true}},{"path":"/pages/production/opTask/checkMaterial","meta":{},"window":{"navigationBarTitleText":"缺料检查","titleNView":true}},{"path":"/pages/production/opTask/opBom","meta":{},"window":{"navigationBarTitleText":"图纸BOM清单","titleNView":true}},{"path":"/pages/production/resistanceTrim/resistanceTrim","meta":{},"window":{"navigationBarTitleText":"电阻配平","titleNView":true}},{"path":"/pages/production/resistanceTrim/trimManage","meta":{},"window":{"navigationBarTitleText":"电阻配平","titleNView":true}},{"path":"/pages/quality/index","meta":{},"window":{"navigationBarTitleText":"质量管理","titleNView":true}},{"path":"/pages/quality/check","meta":{},"window":{"navigationBarTitleText":"质量检验执行","titleNView":true,"softinputMode":"adjustPan"}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":"登录","titleNView":true}},{"path":"/pages/user/message","meta":{},"window":{"navigationBarTitleText":"消息","titleNView":true}},{"path":"/pages/user/user","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的","titleNView":true}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});