import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresVisitor: true
    }
  },
  {
    path: '/post/:id',
    name: 'post',
    component: () => import('../views/Post.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/profil/:id',
    name: 'profil',
    component: () => import('../views/UserProfil.vue'),
    meta: {
      requiresPrivate: true,
    }
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import('../views/UserPage.vue'),
    meta: {
      requiresAuth: true,
    }
  },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

router.beforeEach((to, from, next) => {
	if (to.matched.some((record) => record.meta.requiresAuth)) {
		if (!store.getters.loggedIn) {
			next({
				path: "/login",
			});
		} else {
			next();
		}
  }
  else if (to.matched.some((record) => record.meta.requiresVisitor)) {
		if (store.getters.loggedIn) {
			next({
				path: "/",
			});
		} else {
			next();
		}
  }
  else if (to.matched.some((record) => record.meta.requiresPrivate)) {
		if (store.getters.isOwner !== to.params.id && store.getters.loggedIn) {
			next({
				path: `/user/${to.params.id}`,
			});
		} else {
			next();
		}
  }
  else {
		next(); 
	}
});

export default router
