<template>
	<div class="create-post">
        <div v-if="picture" class="create-post__picture">
			<el-image :src="picture"></el-image>
		</div>
		<el-form class="create-post__form">
            <div class="create-post__form--upload">
            <el-upload
					class="create-post__form--upload--btn"
					action=""
					:show-file-list="false"
					:auto-upload="false"
					:on-change="addPicture"
				>
					<i class="el-icon-picture"></i>
			</el-upload>
            </div>
			<el-form-item class="create-post__form--content">
				<el-input
					type="textarea"
                    :rows="2"
					v-model="content"
					autocomplete="off"
					placeholder="Partagez ici..."
				></el-input>
			</el-form-item>
        </el-form>
            <div class="create-post__btn">
                <el-button type="primary" @click="createPost()"> Publier </el-button>
            </div>
		<div v-if="errorMessage" class="message">
			<el-alert :title="errorMessage" type="error" show-icon> </el-alert>
		</div>
	</div>
</template>

<script>
export default {
	name: "CreatePost",
	data() {
		return {
			content: '',
            picture: '',
            file : '',
            loading: false,
			errorMessage: "",
		};
	},
	methods: {
		addPicture(event) {
            if(event.raw.type == 'image/jpeg' || event.raw.type == 'image/png' || event.raw.type == 'image/jpg'){
                this.picture = URL.createObjectURL(event.raw);
                this.file = event.raw
            }
            else{
                return this.errorMessage = 'Mauvais format'
            }
        },
        createPost(){
            if(this.content === ''){
                return this.errorMessage = 'veuillez ajoutez un texte'
            }
            this.$store.dispatch("createPost", {
					content : this.content,
					image : this.file,
            })
            .then((response)=>{
                const newPostId = response.data.post.postId
                const newPostCtA = response.data.post.createdAt
                this.$root.$emit('newPost', { content :this.content, image :this.file, postId: newPostId, createdAt : newPostCtA} )
                this.content =''
                this.file = ''
                this.picture = ''
            })
            .catch((error)=>{
                this.errorMessage = error.response.data.error;
            })
        },
    },
};
</script>

<style lang="scss" scoped>
.create-post{
    margin: 50px auto 30px auto;
	border-radius: 0.5rem;
	width: 500px;
    &__picture{
        overflow: hidden;
    }
    &__form{
        margin-top: 0.5rem;
        display: flex;
        height: 54px;
        &--content{
            flex: 9;
        }
        &--upload{
            flex: 1;
            display: flex;
            margin-right: 0.5rem;
            justify-content: center;
            align-items: center;
            height: 100%;
            &--btn{
                border: 1px solid #dcdfe6;
                border-radius: 0.5rem;
                padding: 0.4rem;
                i{
                font-size: 1.2rem;
                }
            }
        }
    }
    &__btn{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-left: 0.5rem;
    margin-top: 20px;
    }
}

.message{
    margin-top: 1rem;
}

@media only screen and (max-width: 520px){
	.create-post {
	width: 400px;
	}
}
@media only screen and (max-width: 440px){
	.create-post {
	width: 300px;
    &__btn{
    justify-content: center;
        button{
            width: 100%;
        }
    }
	}
}
</style>
