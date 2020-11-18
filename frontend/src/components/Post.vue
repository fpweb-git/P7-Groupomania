<template>
	<div class="post" v-if="loading">
		<div class="card">
			<div class="card__header">
				<div class="card__header--avatar">
					<el-avatar v-if="post.user.profilePic" :src="post.user.profilePic"></el-avatar>
					<el-avatar v-else icon="el-icon-user-solid"></el-avatar>
				</div>
				<div class="card__header--info">
					<div class="card__header--info--name">{{ post.user.username }}</div>
					<div class="card__header--info--date">{{ post.createdAt.substr(2, 8) }}</div>
				</div>
				<div class="card__header--delete" v-if="isAdmin || post.userId == isOwner"><i class="el-icon-delete" @click="deletePost()"></i></div>
			</div>
			<div class="card__picture" v-if="post.picture">
				<el-image :src="post.picture"></el-image>
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
					<div class="card__social--comment--nbr">
						{{ post.comments.length }} commentaires
					</div>
				</div>
				<div class="card__social--like">
					<div class="card__social--like--nbr">{{ post.likes.length }}</div>
					<div v-if="isLiked()" class="card__social--like--icon--used"><i @click="removeLike()" class="fas fa-heart"></i></div>
					<div v-else class="card__social--like--icon"><i @click="sendLike()" class="far fa-heart"></i></div>
				</div>
			</div>
			<Comments/>
		</div>
	</div>
</template>

<script>
import Comments from "@/components/Comments.vue";

export default {
	components: {
		Comments,
	},
	data() {
		return {
			post: {},
			comments: [{}],
			content : '',
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
			.dispatch("getOnePost")
			.then((response) => {
				this.post = response.data.post;
				this.loading = true;
			})
			.catch((error) => {
				console.log(error)
			});
			this.$root.$on('newComment', ()=>{
				this.post.comments.push({})
			})
			this.$root.$on('commentDeleted', ()=>{
				this.post.comments.pop()
			})
	},
	methods : {
		isLiked(){
			const userLike = (likes) => likes.userId === this.isOwner;
			return this.post.likes.some(userLike)
		},
		sendLike(){
			this.$store.dispatch("sendLike", {
				postId : this.post.postId,
				like : 1,
			})
			.then(() =>{
				this.post.likes.push({ userId : this.isOwner})
			})
			.catch(error =>{
				console.log(error)
			})
		},
		removeLike(){
			this.$store.dispatch("removeLike", {
				postId : this.post.postId,
				like : 0,
			})
			.then(() =>{
				this.post.likes.pop()
			})
			.catch(error =>{
				console.log(error)
			})
		},
		deletePost(){
			this.$store.dispatch("deletePost", {
				postId : this.post.postId,
			})
			.then(() =>{
				this.$router.push('/')
			})
			.catch(error =>{
				console.log(error)
			})
		},
	}
};
</script>

<style scoped lang="scss">
.card {
	&__header {
		&--info {
			flex: 8;
		}
	}
}
</style>
