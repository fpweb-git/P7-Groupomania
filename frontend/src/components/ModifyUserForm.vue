<template>
	<div class="info">
		<div class="info__avatar">
			<el-upload
				class="avatar-uploader"
				ref="upload"
				action=""
				:auto-upload="false"
				:show-file-list="false"
				:on-change="changePic"
			>
				<el-avatar v-if="imageUrl" :src="imageUrl" class="avatar"></el-avatar>
				<el-avatar v-else class="avatar"><i class="el-icon-user"></i></el-avatar>
			</el-upload>
			<i class="el-icon-circle-plus info__avatar--plus-icon"></i>
		</div>
		<div v-if="successMessage" class="message">
			<el-alert :title="successMessage" type="success" show-icon></el-alert>
		</div>
		<div v-if="errorMessage" class="message">
			<el-alert :title="errorMessage" type="error" show-icon> </el-alert>
		</div>
		<div class="info__form">
			<el-form status-icon onsubmit="return false">
				<div class="info__form--item">
					<el-form-item
						label="Nom d'utilisateur"
						label-position="top"
						class="info__form--item--input"
					>
						<el-input
							type="text"
							maxlength="20"
							show-word-limit
							v-model="username"
							autocomplete="off"
							:placeholder="user.username"
						></el-input>
					</el-form-item>
					<el-button
						type="primary"
						@click="modifyUserUsername()"
						class="info__form--item--btn"
						>Modifier</el-button
					>
				</div>
			</el-form>
            <el-form status-icon onsubmit="return false">
				<div class="info__form--item">
					<el-form-item
						label="Email"
						label-position="top"
						class="info__form--item--input"
					>
						<el-input
							type="email"
							v-model="email"
							autocomplete="off"
							:placeholder="user.email"
						></el-input>
					</el-form-item>
					<el-button
						type="primary"
						@click="modifyUserEmail()"
						class="info__form--item--btn"
						>Modifier</el-button
					>
				</div>
			</el-form>
            <el-form status-icon onsubmit="return false">
				<div class="info__form--item">
					<el-form-item
						label="Password"
						label-position="top"
						class="info__form--item--input"
					>
						<el-input
							type="password"
							v-model="password"
							autocomplete="off"
							placeholder="●●●●●●●"
						></el-input>
					</el-form-item>
					<el-button
						type="primary"
						@click="modifyUserPassword()"
						class="info__form--item--btn"
						>Modifier</el-button
					>
				</div>
			</el-form>
		</div>
        <div class="info__delete-btn">
			<el-button type="danger" size="mini" @click="deleteUser()">Supprimer le compte</el-button>
		</div>
	</div>
</template>

<script>
export default {
	name: "UserForm",
	data() {
		return {
			username: "",
			email: "",
			password: "",
			user: {},
			imageUrl: "",
			successMessage: "",
			errorMessage: "",
		};
	},
	mounted() {
		this.$store.dispatch("ConnectedUser")
        .then(response => {
            this.user = response.data
            this.imageUrl = response.data.profilePic
            this.loading = true
        })
        .catch((error)=>{
            console.log(error)
        })
	},
	methods: {
		changePic(event) {
			if(event.raw.type == 'image/jpeg' || event.raw.type == 'image/png' || event.raw.type == 'image/jpg'){
				this.imageUrl = URL.createObjectURL(event.raw);
				this.$store
				.dispatch("modifyPic", event.raw)
				.then(() => {
					this.successMessage = "Photo modifié !";
					this.$root.$emit('newPicture', { picture : URL.createObjectURL(event.raw)} )
				})
				.catch(() => {
					this.errorMessage = "Une erreur s'est produite";
				});
			} else {
				return this.errorMessage = 'Mauvais format'
			}		
		},
		modifyUserUsername() {
			this.$store
				.dispatch("modifyUserUsername", {
					username: this.username,
				})
				.then((response) => {
					this.$root.$emit('newUsername', { username : this.username} )
                    this.errorMessage = "";
                    this.successMessage = response.data.message;
				})
				.catch((error) => {
					if (error.response.data.error.name == "SequelizeUniqueConstraintError") {
                        this.successMessage = ""
                        this.errorMessage = `Nom d'utilisateur deja pris`;
					} else {
                        this.successMessage = ""
						this.errorMessage = error.response.data.error;
					}
				});
        },
        modifyUserEmail() {
			this.$store
				.dispatch("modifyUserEmail", {
					email: this.email,
				})
				.then((response) => {
                    this.errorMessage = "";
                    this.successMessage = response.data.message;
				})
				.catch((error) => {
					if (error.response.data.error.name == "SequelizeUniqueConstraintError") {
						this.errorMessage = `Email deja pris`;
					} else {
                        this.successMessage = ""
						this.errorMessage = error.response.data.error;
					}
				});
        },
        modifyUserPassword() {
			this.$store
				.dispatch("modifyUserPassword", {
					password: this.password,
				})
				.then((response) => {
                    this.password = ""
                    this.errorMessage = "";
					this.successMessage = response.data.message;
				})
				.catch((error) => {
                    this.successMessage = ""
                    this.errorMessage = error.response.data.error;
				});
        },
        deleteUser(){
            this.$store.dispatch("deleteUser")
            .then((response)=>{
                console.log(response.data.message)
                this.$router.push('/login')
            })
            .catch((error) => {
                console.log(error)
			});
        },
	},
};
</script>

<style lang="scss" scoped>
.info {
	margin: 50px auto;
	width: 500px;
	&__form {
		&--item {
			display: flex;
			justify-content: center;
			align-items: center;
			&--input {
				width: 80%;
			}
			&--btn {
				width: 20%;
				height: 40px;
				margin-top: 17px;
				margin-left: 10px;
			}
		}
	}
	&__avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-bottom: 25px;
		&--plus-icon {
			position: absolute;
			font-size: 2rem;
			color: #409eff;
			top: 78%;
			left: 58%;
			background-color: white;
			border-radius: 50%;
			pointer-events: none;
		}
		.el-icon-user .el-upload {
			border: 1px dashed #d9d9d9;
			border-radius: 50%;
			cursor: pointer;
			position: relative;
			overflow: hidden;
		}
		.el-icon-user {
			font-size: 28px;
			color: #ffffff;
			font-size: 5rem;
			line-height: 178px;
			text-align: center;
		}
		.avatar {
			width: 178px;
			height: 178px;
			display: block;
			border-radius: 50%;
		}
	}
	&__delete-btn {
		display: flex;
		align-items: center;
        margin-top: 20px;
	}
}
.message {
	margin: 20px 0;
}

@media only screen and (max-width: 520px){
	.info {
	width: 400px;
	&__form {
			&--item {
				&--btn {
					padding: 0;
					font-size: 0.8rem;
				}
			}
		}
	}
}
@media only screen and (max-width: 440px){
	.info {
	width: 300px;
		&__form {
			&--item {
				&--btn {
					font-size: 0.7rem;
				}
			}
		}
		&__delete-btn {
			justify-content: center;
		}
	}
}
</style>
