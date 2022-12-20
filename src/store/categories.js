import { getDatabase, ref, push, get, update, set } from "firebase/database";

export default {
	actions: {
		async createCategory({ commit, dispatch }, { title, limit }) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				push(ref(database, `users/${uid}/categories/`), { limit, title }).key
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		async getCategories({ commit, dispatch }) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				const categories = await (await get(ref(database, `users/${uid}/categories/`))).val()

				if (!categories) return {}

				const formatedCategories = Object.keys(categories).map(key => ({ ...categories[key], key }))
				return formatedCategories
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		async getCategoryByKey({ commit, dispatch }, key) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				const category = await (await get(ref(database, `users/${uid}/categories/${key}`))).val()

				return { ...category }
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},


		async updateCategories({ commit, dispatch }, { title, limit, key, }) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				await update(ref(database, `users/${uid}/categories/${key}`), { title, limit })
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},
		async deleteCategories({ commit, dispatch }, key) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				await set(ref(database, `users/${uid}/categories/${key}`), null)
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},
	},
}