<template>
	<div class="navbar-user" v-if="loading">
        <router-link :to="{ name: 'profil', params: { id : user.userId}}" class="user-info">
            <el-avatar v-if="user.profilePic" :src="user.profilePic"></el-avatar>
            <el-avatar v-else><i class="el-icon-user"></i></el-avatar>
            <span class="username">{{ user.username }}</span>
        </router-link>
	</div>
</template>

<script>

export default {
    name: "NavbarUser",
    data (){
        return {
			user: {},
            loading: false,
		};
    },
    mounted(){
        this.$store.dispatch("ConnectedUser")
        .then(response => {
            this.user = response.data
            this.loading = true
        })
        .catch((error)=>{
            console.log(error)
        })
    }
};
</script>

<style scoped lang="scss">
a{
    text-decoration: none;
}

.user-info{
    display: flex;
    justify-content: center;
    align-items: center;
}
.el-avatar{
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.5rem;
    i{
        margin-right: 0;
        color: white;
        font-size: 0.9rem;
    }
}
@media only screen and (max-width: 520px){
	.user-info{
        span{
            margin-right: 0px;
        }
		.username{
			display: none;
		}
	}
}

</style>
