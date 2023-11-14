let user = {
	namespaced: true,
	state: {
		batchId: '',
		bizType: ''
	},
	mutations: {
		updateBatchId(state, batchId) {
			state.batchId = batchId
		},
		updateBizType(state, bizType) {
			state.bizType = bizType
		}
	}
}
export default user
