<template>
    <div id="user-posts" v-if="loading">
    <div v-if="posts.length > 0">
    <div class="card" v-for="(post, index) in posts" :key="post.postId">
			<div class="card__header">
				<div class="card__header--avatar">
					<router-link :to="{ name: 'user', params: { id : post.userId}}" class="user-info">
					<el-avatar v-if="post.user.profilePic" :src="post.user.profilePic"></el-avatar>
                    <el-avatar v-else icon="el-icon-user-solid"></el-avatar>
					</router-link>
				</div>
				<div class="card__header--info">
					<div class="card__header--info--name">{{ post.user.username }}</div>
					<div class="card__header--info--date">{{ post.createdAt.substr(2, 8) }}</div>
				</div>
				<div class="card__header--modify"><router-link :to="{ name: 'post', params: { id : post.postId}}"><i class="el-icon-more"></i></router-link></div>
				<div class="card__header--delete" v-if="isAdmin || post.userId == isOwner"><i @click="deletePost(post, index)" class="el-icon-delete"></i></div>
			</div>
			<div class="card__picture" v-if="post.picture">
				<router-link :to="{ name: 'post', params: { id : post.postId}}">
				<el-image :src="post.picture"></el-image>
				</router-link>
			</div>
			<div class="card__text">
				<p>
					{{ post.content }}
				</p>
				<el-divider></el-divider>
			</div>
			<div class="card__social">
				<div class="card__social--comment">
					<div class="card__social--comment--icon">
						<i class="el-icon-chat-round"></i>
					</div>
					<router-link :to="{ name: 'post', params: { id : post.postId}}">
					<div class="card__social--comment--nbr">{{ post.comments.length }} commentaires</div>
					</router-link>
				</div>
				<div class="card__social--like">
					<div class="card__social--like--nbr">{{ post.likes.length }}</div>
					<div v-if="isLiked(post)" class="card__social--like--icon--used"><i @click="removeLike(post)" class="fas fa-heart"></i></div>
					<div v-else class="card__social--like--icon"><i @click="sendLike(post)" class="far fa-heart"></i></div>
				</div>
			</div>
		</div>
    </div>
    <div v-else class="no-content">
			<h2>Pas de contenu</h2>
	</div>
    </div>
</template>

<script>

export default {
    name: 'UserPosts',
	data() {
		return {
			posts: [{}],
			loading: false,
			isOwner: this.$store.getters.isOwner,
		};
    },
    computed: {
		isAdmin() {
			return this.$store.getters.isAdmin;
		},
	},
	mounted() {
		this.$store
			.dispatch("getPostsOfOneUser")
			.then((response) => {
				this.posts = response.data.reverse();
                this.loading = true;
			})
            .catch((error) => {
				console.log(error)
			});
	},
	methods : {
		isLiked(post){
			const userLike = (likes) => likes.userId === this.isOwner;
			return post.likes.some(userLike)
		},
		sendLike(post){
			this.$store.dispatch("sendLike", {
				postId : post.postId,
				like : 1,
			})
			.then(() =>{
				post.likes.push({ userId : this.isOwner})
			})
			.catch(error =>{
				console.log(error)
			})
		},
		removeLike(post){
			this.$store.dispatch("removeLike", {
				postId : post.postId,
				like : 0,
			})
			.then(() =>{
				post.likes.pop()
			})
			.catch(error =>{
				console.log(error)
			})
		},
		deletePost(post, index){
			this.$store.dispatch("deletePost", {
				postId : post.postId,
			})
			.then(() =>{
				this.posts.splice(index, 1)
			})
			.catch(error =>{
				console.log(error)
			})
		},
	},
};
</script>

<style lang="scss">
.no-content {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 30px;
}
</style>