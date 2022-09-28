import { createStore } from 'vuex'
import auth from './auth.js'
import errorWorker from './errorWorker.js'
import info from './info'
import categories from './categories'
import records from './records'

export default createStore({
	modules: {
		auth,
		errorWorker,
		info,
		categories,
		records
	}
})
