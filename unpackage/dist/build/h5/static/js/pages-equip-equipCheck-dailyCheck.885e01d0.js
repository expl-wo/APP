(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-equip-equipCheck-dailyCheck"],{"0490":function(e,t,n){"use strict";n.r(t);var i=n("cf68"),a=n.n(i);for(var c in i)["default"].indexOf(c)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(c);t["default"]=a.a},"28e7":function(e,t,n){"use strict";n.r(t);var i=n("5165"),a=n("0490");for(var c in a)["default"].indexOf(c)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(c);var u=n("f0c5"),o=Object(u["a"])(a["default"],i["b"],i["c"],!1,null,"55097fc2",null,!1,i["a"],void 0);t["default"]=o.exports},5165:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return c})),n.d(t,"a",(function(){return i}));var i={uEmpty:n("0101").default},a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",{staticClass:"content"},[n("v-uni-view",{staticStyle:{"margin-left":"10px"}},[n("v-uni-checkbox-group",{on:{change:function(t){arguments[0]=t=e.$handleEvent(t),e.checkboxChange.apply(void 0,arguments)}}},[n("v-uni-label",[n("v-uni-checkbox",{attrs:{value:e.cb}}),e._v("未安排责任人设备点检任务")],1)],1)],1),n("u-empty",{directives:[{name:"show",rawName:"v-show",value:null==e.checkListData||0==e.checkListData.length,expression:"checkListData==null||checkListData.length == 0"}],attrs:{mode:"list",text:"无点检任务"}}),n("v-uni-view",{staticClass:"app-containerR app-containerWrap"},e._l(e.checkListData,(function(t,i){return n("v-uni-view",{key:t.eqpId,staticClass:"group-warter w-240 tc text bg-blue",on:{click:function(n){arguments[0]=n=e.$handleEvent(n),e.tap(t)}}},[n("v-uni-view",{staticClass:"group-title"},[e._v("设备名称："+e._s(t.eqpName))]),n("v-uni-view",{staticClass:"group-bomtitle tc"},[e._v("使用部门："+e._s(t.usingDepName))]),n("v-uni-view",{staticClass:"group-bomtitle tc"},[e._v("设备编码："+e._s(t.eqpId))]),n("v-uni-view",{staticClass:"group-bomtitle tc"},[e._v("班组："+e._s(t.installSite))])],1)})),1)],1)},c=[]},6980:function(e,t,n){"use strict";n("7a82");var i=n("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.getOtherSpotCheckList=function(e){return(0,a.default)({url:"/pbequipment/equipCheck/othercheck",method:"get",data:e})},t.getProSpotCheckList=function(e){return(0,a.default)({url:"/pbequipment/equipCheck/proCheck",method:"get",data:e})},t.getSpotCheckItems=function(e){return(0,a.default)({url:"/pbequipment/equipCheck/opInit",method:"get",data:e})},t.keepCheckRec=function(e){return(0,a.default)({url:"/pbequipment/equipCheck/keepCheckRec",method:"post",data:e})},t.spotCheckSubmit=function(e){return(0,a.default)({url:"/pbequipment/equipCheck/checkSubmit",method:"post",data:e})};var a=i(n("3d7c"))},"9b6c":function(e,t,n){"use strict";n("7a82");var i=n("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.$confirm=function(e){return new Promise((function(t,n){uni.showModal({title:"提示",content:e,success:function(e){e.confirm?t():uni.showToast({icon:"none",title:"已取消",duration:1e3})}})}))},t.$message=function(e){setTimeout((function(){uni.showToast({icon:"none",title:e,duration:3e3})}),100)},t.getCardInfo=function(e){return a.default.isNotEmpty(e)&&e.indexOf("PNO=")>=0?e.substr(e.indexOf("PNO=")+4):""},t.getValueFromList=function(e,t){var n=e.find((function(e){return e.code===t}));return n?n.name:""},t.getVersion=c,t.getVersionDesc=function(){var e="z"===getFormalData(),t=c();return t=u(e,t).label,t},t.getVersionItem=u,t.isEmptyObj=function(e){return"{}"==JSON.stringify(e)},t.needUpVersion=function(e){return new Promise((function(e,t){e({needUp:!1,widgetInfo:{}})}))},t.timeTranslate=function(e){var t=e?new Date(e):new Date,n=t.getMonth()+1,i=t.getDate();n>=1&&n<=9&&(n="0"+n);i>=0&&i<=9&&(i="0"+i);var a=t.getFullYear()+"-"+n+"-"+i;return a},n("d3b7"),n("e9c4"),n("7db0"),n("e25e"),n("c975");var a=i(n("fcb1"));function c(){return""}function u(e,t){return t&&(t="V"+t),e?{type:a.default.flag.y,label:"正式版"+t}:{type:a.default.flag.n,label:"测试版"+t}}},cf68:function(e,t,n){"use strict";n("7a82"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("e9c4");var i=n("6980"),a=(n("9b6c"),{data:function(){return{cb:"0",needRefresh:!1,checkListData:[]}},methods:{checkboxChange:function(e){var t=this;this.checkListData=[],"0"==e.detail.value?(e.detail.value,this.cb="1"):(e.detail.value,this.cb="0"),console.log(this.cb),(0,i.getOtherSpotCheckList)({findNoManager:this.cb}).then((function(e){t.checkListData=e.data}))},onShow:function(){var e=this;this.checkListData=[],(0,i.getOtherSpotCheckList)({findNoManager:this.cb}).then((function(t){console.log("点检",t),e.checkListData=t.data}))},tap:function(e){uni.navigateTo({url:"/pages/equip/equipCheck/checkItem?eqpItem="+JSON.stringify(e)+"&type=qita"})}}});t.default=a}}]);