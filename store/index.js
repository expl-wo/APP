import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import biz from './modules/biz'
import workOrder from './modules/workOrder.js'

Vue.use(Vuex)
const store = new Vuex.Store({
	namespaced: true,
	state: {},
	mutations: {},
	actions: {},
	modules: {
		user,
		biz,
		workOrder
	}
})
export default store