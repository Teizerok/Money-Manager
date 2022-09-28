import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, set, ref } from "firebase/database";


export default {
	actions: {
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

		async register({ dispatch }, { email, password, name, language }) {
			try {
				const auth = getAuth()
				await createUserWithEmailAndPassword(auth, email, password)

				const uid = await dispatch('getUId')
				const database = getDatabase();

				set(ref(database, `users/${uid}/info`), {
					name,
					language
				})
			}
			catch (e) {
				const message = await dispatch('normalizeError', e)
				dispatch('updateSetError', message)
				throw e
			}
		},

		getUId() {
			const auth = getAuth();
			const user = auth.currentUser;
			return user ? user.uid : null
		},

		async logout({ commit }) {
			await getAuth().signOut()
			commit('clearInfo')
		}
	}
}