import { getDatabase, ref, update, get, onValue } from "firebase/database";
import { loadRatesFor } from '../api'

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

				const infoData = {
					name: infoStorage.name,
					language: infoStorage.language,
					currentCurrency: infoStorage.currentCurrency,
				}

				commit('setInfo', infoData)
				await dispatch('computeBill')
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
				const pathInfo = ref(database, `users/${uid}/info/`)


				onValue(pathRecords, async () => {
					await dispatch("loadInfo");
				});

				onValue(pathInfo, async () => {
					await dispatch("loadInfo");
				});

			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},


		async computeBill({ dispatch, commit, getters }) {
			try {
				const database = getDatabase()
				const uid = await dispatch('getUId')

				let records = await (await get(ref(database, `users/${uid}/records/`))).val()
				const rates = await loadRatesFor(getters.info.currentCurrency)

				if (!records) return 0
				records = Object.entries(records)

				const sumedRecords = records.reduce((total, [key, record]) => {
					if (record.type === 'income')
						return total += +record.amount / (rates[record.currency] || 1)

					else
						return total -= +record.amount / (rates[record.currency] || 1)
				}, 0)

				commit('setBill', sumedRecords)

			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		}
	},

	state: {
		infoUser: {
			language: 'en',
			currentCurrency: 'UAH'
		},
		isPopup: false
	},

	getters: {
		info(state) {
			return state.infoUser
		},
		getLanguage(state) {
			return state.infoUser.language
		},
		isPopupOpen(state) {
			return state.isPopup
		}
	},

	mutations: {
		setInfo(state, info) {
			state.infoUser = info
		},
		setLanguage(state, language) {
			state.infoUser.language = language
		},

		clearInfo(state) {
			state.infoUser = {}
		},

		setBill(state, bill) {
			state.infoUser.bill = bill
		},

		openPopup(state) {
			state.isPopup = true
		},
		closePopup(state) {
			state.isPopup = false
		}
	},
}