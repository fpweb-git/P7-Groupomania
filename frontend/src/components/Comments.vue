<template>
    <div class="card__comments" v-if="loading">
				<div class="card__comments--post">
					<el-form class="card__comments--post--form">
						<el-form-item class="card__comments--post--form--input">
							<el-input
								type="textarea"
								autosize
								v-model="content"
								placeholder="Votre commentaire...">
								</el-input>
						</el-form-item>
						<el-form-item class="card__comments--post--form--btn">
							<el-button type="primary" @click="postComment"
								><i class="el-icon-s-promotion"></i
							></el-button>
						</el-form-item>
					</el-form>
					<div v-if="errorMessage" class="message">
						<el-alert :title="errorMessage" type="error" show-icon> </el-alert>
					</div>
				</div>
				<div
					class="card__comments--list"
					v-for="(comment, index) in comments"
					:key="comment.id"
				>
					<div class="card__comments--list--comment">
						<div class="card__comments--list--comment--avatar">
							<el-avatar
								v-if="comment.user.profilePic"
								:src="comment.user.profilePic"
							></el-avatar>
							<el-avatar v-else icon="el-icon-user-solid"></el-avatar>
						</div>
						<div class="card__comments--list--comment--bloc">
						<div class="card__comments--list--comment--username">{{comment.user.username}}</div>
						<div class="card__comments--list--comment--content">
								{{ comment.content }}
							<i v-if="comment.userId == userId || isAdmin" class="el-icon-circle-close" @click="deleteComment(comment, index)"></i>
						</div>
						</div>
					</div>
				</div>
			</div>
</template>

<script>

export default {
	data() {
		return {
			comments: [{}],
			content : '',
			loading: false,
			userId :this.$store.state.user.userId,
			errorMessage: "",
		};
	},
	computed: {
		isAdmin() {
			return this.$store.getters.isAdmin;
		},
	},
	mounted() {
		this.$store
			.dispatch("getAllComments")
			.then((response) => {
				this.comments = response.data;
                this.loading = true;
			})
			.catch((error) => {
				console.log(error)
			});
    },
	methods : {
		postComment(){
			if(this.content === ""){
				this.errorMessage = "Veuillez remplir le champ"
			} else {
				this.$store.dispatch("postComment", {
				content: this.content,
			})
			.then((response) => {
				this.content = ''
				const contentSent = JSON.parse(response.config.data)
				const commentId = response.data.comment.commentId
				this.comments.push({ content : contentSent.content , commentId: commentId, userId: this.$store.state.user.userId ,user : {profilePic : this.$store.state.user.profilePic, username : this.$store.state.user.username}})
				this.$root.$emit('newComment')
				this.loading = true;
			})
			.catch((error) => {
				console.log(error);
			});
			}
		},
		deleteComment(comment, index){
			this.$store
			.dispatch("deleteComment", {
				commentId: comment.commentId,
			})
			.then(() => {
				this.comments.splice(index, 1)
				this.$root.$emit('commentDeleted')
			})
			.catch((error) => {
				console.log(error);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
	.card__comments {
		margin-bottom: 1rem;
		&--post{
			margin-top: 0.7rem;
			&--form{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				padding: 0.5rem 1rem;
				&--input{
					flex: 9;
					margin: auto;
				}
				&--btn{
					flex: 1;
					margin: 0.5rem auto auto 1rem;
					button{
						width: 100%;
						height: 33px;
						display: flex;
						justify-content: center;
						align-items: center;
						i{
							font-size: 1.2rem;
						}
					}
				}
			}
		}
		&--list {
			padding: 0.5rem;
			&--comment {
				display: flex;
				padding: 0.5rem;
				&--avatar {
					flex: 1;
					.el-avatar {
						width: 34px;
						height: 34px;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
				&--bloc{
					flex: 9;
					margin-left: 0.5rem;
				}
				&--username{
					padding: 0.5rem 0;
				}
				&--content {
					word-break: break-all;
					padding: 0.8rem;
					border-radius: 0.5rem;
					background-color: #f2f2f2;
					font-size: 0.9rem;
					display: flex;
					justify-content: space-between;
					i{
						margin-left: 0.5rem;
						cursor: pointer;
						color: #F56C6C;
						font-size: 1rem;
					}

				}
			}
		}
	}
@media only screen and (max-width: 520px){
.card__comments {
		&--post{
			&--form{
				&--input{
					flex: 8;
				}
				&--btn{
					flex: 2;
					margin-left: 1rem;
				}
			}
		}
	}
}
</style>