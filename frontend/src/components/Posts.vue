<template>
	<div class="post" v-if="loading">
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
</template>

<script>
export default {
	name: "Posts",
	data() {
		return {
			posts: [{
			}],
			loading: false,
			isOwner: this.$store.getters.isOwner,
			newPostId : ''
		};
	},
	computed: {
		isAdmin() {
			return this.$store.getters.isAdmin;
		},
	},
	mounted() {
            this.$store.dispatch("fetchPost")
            .then(response => {
				this.posts = response.data.reverse()  
				this.loading = true
			})
			.catch((error)=>{
				console.log(error)
			})
			this.$root.$on('newPost', (value)=>{
				const image = (value.image === "") ? "": URL.createObjectURL(value.image)
				this.posts.unshift({
					comments: [],
					content : value.content,
					createdAt : value.createdAt,
					likes : [],
					picture : image,
					postId : value.postId,
					user : {profilePic : this.$store.state.user.profilePic, username: this.$store.state.user.username},
					userId: this.$store.state.user.userId,
				})
			})
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
.card {
	margin: 50px auto;
	border: 1px solid rgb(218, 218, 218);
	border-radius: 0.5rem;
	width: 500px;
	-webkit-box-shadow: 0 6px 6px -6px rgb(202, 202, 202);
	-moz-box-shadow: 0 6px 6px -6px rgb(202, 202, 202);
	box-shadow: 0 6px 6px -6px rgb(202, 202, 202);
	background-color: white;
	&__header {
		padding: 0.6rem;
		display: flex;
		align-items: center;
		&--avatar {
			flex: 1;
		}
		&--info {
			flex: 6;
			margin-left: 0.5rem;
			&--date {
				font-size: 0.7rem;
			}
		}
		&--modify {
			flex: 3;
			font-size: 1.5rem;
			text-align: right;
			margin-right: 0.5rem;
			color: #828282;
			cursor: pointer;
		}
		&--delete {
			cursor: pointer;
			color: #F56C6C;
		}
	}
	&__picture {
		img{
			object-fit: cover;
		}
	}
	&__text {
		padding: 0.5rem 0.8rem;
	}
	&__social {
		display: flex;
		align-items: center;
		padding: 0.8rem 0.6rem 0.8rem 0.6rem;
		&--comment {
			cursor: pointer;
			display: flex;
			align-items: center;
			flex: 1;
			&--icon {
				font-size: 1.2rem;
			}
			&--nbr {
				font-size: 0.9rem;
				padding-left: 0.5rem;
			}
		}
		&--like {
			display: flex;
			align-items: center;
			flex: 1;
			justify-content: flex-end;
			margin-right: 0.5rem;
			&--icon {
				font-size: 1.1rem;
				cursor: pointer;
			}
			&--icon--used {
				font-size: 1.1rem;
				cursor: pointer;
				color: #F56C6C;
			}
			&--nbr {
				font-size: 0.8rem;
				padding-right: 0.5rem;
			}
		}
	}
	.el-divider {
		margin: 18px 0 0 0;
	}
}
@media only screen and (max-width: 520px){
	.card {
	width: 400px;
	}
}
@media only screen and (max-width: 440px){
	.card {
	width: 300px;
	}
}
</style>
