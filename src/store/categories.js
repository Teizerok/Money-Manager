import { getDatabase, ref, push, get, update, set } from "firebase/database";

export default {
	actions: {
		//создание новой категории, функция получает объект настроеной категории с полями:  title, limit. 

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


		//получение всех категорий
		async getCategories({ commit, dispatch }) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				const categories = await (await get(ref(database, `users/${uid}/categories/`))).val()

				if (!categories) return {}

				//добавление индефикатора в категорию по которой последняя хранится бд
				const formatedCategories = Object.keys(categories).map(key => ({ ...categories[key], key }))
				return formatedCategories
			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},

		//получение конкретной категории по индефикатору
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

		//обновление конкретной категории, возможность поменять имя и лимит
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

		//удаление конкретной категории по индефикатору и всех записей записаных в нее
		async deleteCategoryByKey({ commit, dispatch }, keyCategory) {
			try {
				const database = getDatabase();
				const uid = await dispatch('getUId')

				const records = await dispatch('getRecords')
				await set(ref(database, `users/${uid}/categories/${keyCategory}`), null)


				//поиск записей записаных в удаляемую категорию с дальнейшим удалением
				records.forEach(async (record) => {
					if (record.category === keyCategory) {
						await dispatch('deleteRecord', { key: record.key })
					}
				})


			} catch (e) {
				const message = await dispatch('normalizeError', e)
				commit('setError', message)
				throw e
			}
		},
	},
}