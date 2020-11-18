import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "@/router";

Vue.use(Vuex);

axios.defaults.baseURL = "http://localhost:3000/api";

export default new Vuex.Store({
	state: {
		token: localStorage.getItem("access_token") || null,
		user : {},
	},
	getters: {
		loggedIn(state) {
			return state.token !== null;
		},
		isAdmin(state) {
			const admin = JSON.parse(atob(state.token.split(".")[1])).isAdmin;
			return admin;
		},
		isOwner(state) {
			const owner = JSON.parse(atob(state.token.split(".")[1])).userId;
			return owner;
		},
	},
	mutations: {
		retrieveToken(state, token) {
			state.token = token;
		},
		logout(state) {
			state.token = null;
		},
	},
	actions: {
		createAccount(context, credentials) {
			return new Promise((resolve, reject) => {
				axios
					.post("/auth/signup", {
						username: credentials.username,
						email: credentials.email,
						password: credentials.password,
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		retrieveToken(context, credentials) {
			return new Promise((resolve, reject) => {
				axios
					.post("/auth/login", {
						email: credentials.email,
						password: credentials.password,
					})
					.then((response) => {
						const token = response.data.token;
						localStorage.setItem("access_token", token);
						context.commit("retrieveToken", token);
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		logout(context) {
			if (context.getters.loggedIn) {
				localStorage.removeItem("access_token");
				context.commit("logout");
			} else {
				console.log("Vous devez être connecté");
			}
		},
		fetchPost() {
			return new Promise((resolve, reject) => {
				const authToken = "Bearer " + this.state.token;
				axios
					.get("/post", { headers: { Authorization: authToken } })
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		getOnePost() {
			return new Promise((resolve, reject) => {
				const urlId = router.currentRoute.params.id;
				const authToken = "Bearer " + this.state.token;
				axios
					.get(`/post/${urlId}`, { headers: { Authorization: authToken } })
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		getPostsOfOneUser() {
			return new Promise((resolve, reject) => {
				const userId = router.currentRoute.params.id;
				const authToken = "Bearer " + this.state.token;
				axios
					.get(`/post/users/${userId}`, { headers: { Authorization: authToken } })
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		GetOneUser() {
			return new Promise((resolve, reject) => {
				const userId = router.currentRoute.params.id;
				const authToken = "Bearer " + this.state.token;
				axios
					.get(`/auth/users/${userId}`, { headers: { Authorization: authToken } })
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		ConnectedUser() {
			return new Promise((resolve, reject) => {
				const userId = JSON.parse(atob(this.state.token.split(".")[1])).userId;
				const authToken = "Bearer " + this.state.token;
				axios
					.get(`/auth/users/${userId}`, { headers: { Authorization: authToken } })
					.then((response) => {
						this.state.user =  response.data
						console.log('call') 
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		modifyPic(context, credentials) {
			return new Promise((resolve, reject) => {
				const userId = JSON.parse(atob(this.state.token.split(".")[1])).userId;
				const authToken = "Bearer " + this.state.token;
				const formData = new FormData();
				formData.append("image", credentials, credentials.name);
				console.log(credentials);
				axios
					.put(`/auth/users/pic/${userId}`, formData, {
						headers: { Authorization: authToken },
						"Content-Type": "multipart/form-data",
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		modifyUserUsername(context, credentials) {
			return new Promise((resolve, reject) => {
				const userId = JSON.parse(atob(this.state.token.split(".")[1])).userId;
				const authToken = "Bearer " + this.state.token;
				axios
					.put(`/auth/users/${userId}/username`, credentials, {
						headers: { Authorization: authToken },
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			})
		},
		modifyUserEmail(context, credentials) {
			return new Promise((resolve, reject) => {
				const userId = JSON.parse(atob(this.state.token.split(".")[1])).userId;
				const authToken = "Bearer " + this.state.token;
				axios
					.put(`/auth/users/${userId}/email`, credentials, {
						headers: { Authorization: authToken },
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			})
		},
		modifyUserPassword(context, credentials) {
			return new Promise((resolve, reject) => {
				const userId = JSON.parse(atob(this.state.token.split(".")[1])).userId;
				const authToken = "Bearer " + this.state.token;
				axios
					.put(`/auth/users/${userId}/password`, credentials, {
						headers: { Authorization: authToken },
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			})
		},
		deleteUser(context){
			return new Promise((resolve, reject) => {
				const userId = JSON.parse(atob(this.state.token.split(".")[1])).userId;
				const authToken = "Bearer " + this.state.token;
				axios
					.delete(`/auth/users/${userId}`, {
						headers: { Authorization: authToken },
					})
					.then((response) => {
						localStorage.removeItem("access_token");
						context.commit("logout");
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			})
		},
		deleteUserAdmin(){
			return new Promise((resolve, reject) => {
				const userId = router.currentRoute.params.id;
				const authToken = "Bearer " + this.state.token;
				axios
					.delete(`/auth/users/${userId}`, {
						headers: { Authorization: authToken },
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			})
		},
		createPost(context, credentials){
			return new Promise((resolve, reject) => {
				const authToken = "Bearer " + this.state.token;
				const formData = new FormData();
				formData.append("content", credentials.content);
				if(credentials.image !== ""){
					formData.append("image", credentials.image, credentials.image.name);
				}
				axios
					.post(`/post`, formData, {
						headers: { Authorization: authToken },
						"Content-Type": "multipart/form-data",
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		sendLike(context, credentials){
			return new Promise((resolve, reject) => {
				const authToken = "Bearer " + this.state.token;
				const postId = credentials.postId;
				const like = { like : credentials.like}
				axios
					.post(`/post/${postId}/like`, like, {
						headers: { Authorization: authToken },
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		removeLike(context, credentials){
			return new Promise((resolve, reject) => {
				const authToken = "Bearer " + this.state.token;
				const postId = credentials.postId;
				const like = { like : credentials.like}
				axios
					.post(`/post/${postId}/like`, like, {
						headers: { Authorization: authToken },
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		getAllComments() {
			return new Promise((resolve, reject) => {
				const postId = router.currentRoute.params.id;
				const authToken = "Bearer " + this.state.token;
				axios
					.get(`/post/${postId}/comment`, { headers: { Authorization: authToken } })
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						console.log(error);
						reject(error);
					});
			});
		},
		postComment(context, credentials){
			return new Promise((resolve, reject) => {
				const postId = router.currentRoute.params.id;
				const content = { content : credentials.content}
				const authToken = "Bearer " + this.state.token;
				axios
					.post(`post/${postId}/comment`, content, {
						headers: { Authorization: authToken }
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		deleteComment(context, credentials){
			return new Promise((resolve, reject) => {
			const postId = router.currentRoute.params.id;
			const commentId = credentials.commentId
			const authToken = "Bearer " + this.state.token;
			axios.delete(`post/${postId}/comment/${commentId}`, {
						headers: { Authorization: authToken }
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			})
		},
		deletePost(context, credentials){
			return new Promise((resolve, reject) => {
			const postId = credentials.postId
			const authToken = "Bearer " + this.state.token;
			axios.delete(`post/${postId}`, { 
				headers: { Authorization: authToken }
					})
					.then((response) => {
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			})
		}
	},
	modules: {},
});
