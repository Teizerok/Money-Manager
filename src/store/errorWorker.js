export default {
	actions: {
		updateSetError({ commit }, message) {
			commit('setError', message)
		},

		//преобразование ошибки в строку
		normalizeError({ }, e) {
			return JSON.parse(JSON.stringify(e.code))
		},
	},

	state: {
		//если появится какая то ошибка она будет отловлена в layout-ах 
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