import { getDatabase, ref, push, get, set } from "firebase/database";

export default {
	actions: {
		async createRecord({ commit, dispatch }, record) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				await push(ref(database, `users/${uid}/records/`), record)
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		async getRecords({ commit, dispatch }) {

			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				const records = await (await get(ref(database, `users/${uid}/records/`))).val()

				if (!records) return {}

				const formatedrecords = Object.keys(records).map(key => ({ ...records[key], key }))

				return formatedrecords
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		async getRecordByKey({ commit, dispatch }, key) {
			try {

				const database = getDatabase();
				const uid = await dispatch('getUId');

				const record = await (await get(ref(database, `users/${uid}/records/${key}`))).val()

				return { ...record }
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		async deleteRecord({ commit, dispatch }, { key }) {
			try {

				const database = getDatabase();
				const uid = await dispatch('getUId');

				await set(ref(database, `users/${uid}/records/${key}`), null)
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		}

	},
}