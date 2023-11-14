import Vue from 'vue'
let receiveMsg = uni.getStorageSync('wms_recevie_msg');
if(receiveMsg !== 'y'){
	receiveMsg =  'n'
}
let user = {
	namespaced: true,
	state: {
		receiveMsg,
	},
	mutations: {
		updateReceiveMsg(state, receiveMsg){
			state.receiveMsg = receiveMsg
		},
	}
}
export default user
