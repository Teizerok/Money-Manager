import { createApp } from 'vue'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import App from './App.vue'
import router from './router'
import store from './store'
import 'materialize-css/dist/js/materialize.min.js'
import './registerServiceWorker'

const firebaseConfig = {
	apiKey: "AIzaSyDmSImKCmQ9XOhprv9rQwbYfhHwGpJ_skY",
	authDomain: "money-manager-7b6e3.firebaseapp.com",
	databaseURL: "https://money-manager-7b6e3-default-rtdb.firebaseio.com",
	projectId: "money-manager-7b6e3",
	storageBucket: "money-manager-7b6e3.appspot.com",
	messagingSenderId: "325256745635",
	appId: "1:325256745635:web:01b3595e97400b5cd1a516",
	measurementId: "G-H6CYCN68MY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let started = false

getAuth()

	.onAuthStateChanged(() => {

		if (!started) {
			createApp(App).use(store).use(router).mount('#app')
			started = true
		}
	})
