import { createRouter, createWebHistory } from 'vue-router'
import { getAuth } from "firebase/auth";

const routes = [
	{
		path: '/login',
		name: 'login',
		meta: {
			layout: 'empty-layout',
		},
		component: () => import('../components/views/loginView.vue')
	},
	{
		path: '/register',
		name: 'register',
		meta: {
			layout: 'empty-layout',
		},
		component: () => import('../components/views/registerView.vue')
	},
	{
		path: '/',
		name: 'home',
		meta: {
			layout: 'main-layout',
			auth: true
		},
		component: () => import('../components/views/homeView.vue')
	},
	{
		path: '/categories',
		name: 'categories',
		meta: {
			layout: 'main-layout',
			auth: true
		},
		component: () => import('../components/views/categoriesView.vue')
	},
	{
		path: '/detail/:key',
		name: 'detail',
		meta: {
			layout: 'main-layout',
			auth: true
		},
		component: () => import('../components/views/detailRecordView.vue')
	},
	{
		path: '/history',
		name: 'history',
		meta: {
			layout: 'main-layout',
			auth: true
		},
		component: () => import('../components/views/historyView.vue')
	},
	{
		path: '/planning',
		name: 'planning',
		meta: {
			layout: 'main-layout',
			auth: true
		},
		component: () => import('../components/views/planningView.vue')
	},
	{
		path: '/profile',
		name: 'profile',
		meta: {
			layout: 'main-layout',
			auth: true
		},
		component: () => import('../components/views/profileView.vue')
	},
	{
		path: '/records',
		name: 'records',
		meta: {
			layout: 'main-layout',
			auth: true
		},
		component: () => import('../components/views/recordsView.vue')
	},


]


const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	const currentUser = getAuth().currentUser
	const requiredAuth = to.matched.some(record => record.meta.auth)

	if (requiredAuth && !currentUser) next('/login?message=login')
	else next()


})


export default router
