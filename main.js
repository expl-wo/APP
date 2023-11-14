// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import VueI18n from 'vue-i18n'
import store from './store'
import i18nConfig from './lang/index.js'
import constants from './utils/constants.js'
import calculate from './utils/calculate.js'
import utilFunction from './utils/util-function.js'
import filterInstall from './filter/index.js'
import {initBtnPri} from '@/utils/quanxian.js'

Vue.use(uView);
Vue.use(VueI18n);
filterInstall(Vue);

const i18n = new VueI18n(i18nConfig);
Vue.prototype._i18n = i18n 

Vue.prototype.$store = store;

initBtnPri(Vue);
//初始化常量
Vue.prototype.$constants = constants;
//初始化计算方法
Vue.prototype.$calculate = calculate;
//初始化供公用函数
Vue.prototype.$utilFunction = utilFunction;

Vue.config.productionTip = false

App.mpType = 'app'

uni.$u.setConfig({
	// 修改$u.config对象的属性
	config: {
		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
		unit: 'rpx'
	},
	// 修改$u.props对象的属性
	props: {
		// 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
		radio: {
			size: 15
		},
		button: {
		}
		// 其他组件属性配置
		// ......
	}
})

const app = new Vue({
	i18n,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
