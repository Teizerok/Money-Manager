import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";


export default {
	actions: {
		//вход в сессию по паролю и имейлу
		async login({ dispatch }, { email, password }) {
			try {
				const auth = getAuth()
				await signInWithEmailAndPassword(auth, email, password)
			}
			catch (e) {
				const message = await dispatch('normalizeError', e)
				dispatch('updateSetError', message)
				throw e
			}
		},

		//регистрация нового пользователя
		async register({ dispatch }, { email, password, name, language, currentCurrency }) {
			try {
				const auth = getAuth()
				await createUserWithEmailAndPassword(auth, email, password)

				const uid = await dispatch('getUId')
				const database = getDatabase();

				set(ref(database, `users/${uid}/info`), {
					name,
					language,
					currentCurrency
				})
			}
			catch (e) {
				const message = await dispatch('normalizeError', e)
				dispatch('updateSetError', message)
				throw e
			}
		},

		//получение id пользователя по актуальной сессии
		getUId() {
			const auth = getAuth();
			const user = auth.currentUser;
			return user ? user.uid : null
		},

		//выход из сессии
		async logout({ commit }) {
			await getAuth().signOut()
			commit('clearInfo')
		}
	}
}