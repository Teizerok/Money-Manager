import { getDatabase, ref, update, get, onValue } from "firebase/database";

export default {
	actions: {
		async updateInfo({ dispatch, getters, commit }, toUpdate) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				const dataForUpdate = { ...getters.info, ...toUpdate }

				await update(ref(database, `users/${uid}/info`), dataForUpdate)
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		async loadInfo({ dispatch, commit }) {
			try {
				const database = getDatabase()
				const uid = await dispatch('getUId')

				const infoStorage = await (await get(ref(database, `users/${uid}/info/`))).val()
				const computedBill = await dispatch('computeBill')

				const infoData = {
					name: infoStorage.name,
					bill: computedBill,
					language: infoStorage.language
				}

				commit('setInfo', infoData)
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		async subscribeToUpdateInfo({ dispatch, commit }) {
			try {
				const database = getDatabase()
				const uid = await dispatch('getUId')

				const pathRecords = ref(database, `users/${uid}/records/`)

				onValue(pathRecords, async () => {
					await dispatch("loadInfo");
				});


				const pathInfo = ref(database, `users/${uid}/info/`)

				onValue(pathInfo, async () => {
					await dispatch("loadInfo");
				});

			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},


		async computeBill({ dispatch, commit }) {
			try {
				const database = getDatabase()
				const uid = await dispatch('getUId')

				let records = await (await get(ref(database, `users/${uid}/records/`))).val()

				if (!records) return 0
				records = Object.entries(records)

				return records.reduce((total, [key, record]) => {
					if (record.type === 'income') return total += +record.amount
					else return total -= +record.amount
				}, 0)

			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		}
	},

	state: {
		infoUser: {

		}
	},

	getters: {
		info(state) {
			return state.infoUser
		}
	},

	mutations: {
		setInfo(state, info) {
			state.infoUser = info
		},

		clearInfo(state) {
			state.infoUser = {}
		}
	},
}