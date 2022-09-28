export default {
	actions: {
		updateSetError({ commit }, message) {
			commit('setError', message)
		},

		normalizeError({ }, e) {
			return JSON.parse(JSON.stringify(e.code))
		},
	},

	state: {
		error: null,
	},

	getters: {
		getError(state) {
			return state.error
		}
	},

	mutations: {
		setError(state, error) {
			state.error = error
		},

		clearError(state) {
			state.error = null
		}
	},
}