<template>
    <div class="user-header" v-if="loading">
        <div class="user-info">
            <div class="user-info__avatar">
                <el-avatar v-if="user.profilePic" :src="user.profilePic"></el-avatar>
                <el-avatar v-else><i class="el-icon-user"></i></el-avatar>
            </div>
            <div class="user-info__text">
                <h2>{{ user.username }}</h2>
                <span> {{ user.email }} </span>
                <el-button v-if="isAdmin" type="danger" size="mini" @click="deleteUser()">Supprimer le compte</el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'user-header',
    data() {
		return {
			user: {},
            loading: false,
		};
    },
    computed: {
		isAdmin() {
			return this.$store.getters.isAdmin;
		},
	},
    mounted(){
        this.$store.dispatch("GetOneUser")
        .then(response => {
            this.user = response.data
            this.loading = true
        })
        .catch((error)=>{
            console.log(error)
        })
    },
    methods:{
        deleteUser(){
            this.$store.dispatch("deleteUserAdmin")
            .then((response)=>{
                console.log(response.data.message)
                    this.$router.push('/')
            })
            .catch((error) => {
                console.log(error)
			});
        },
    },
}
</script>

<style lang="scss" scoped>
.user-info{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 0;
    margin-bottom: 80px;
    background-color: #FAFAFA;
    border-bottom: 1px dashed #FAFAFA;;
    &__avatar{
        margin-right: 1.5rem;
        .el-avatar{ 
        width: 120px;
		height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
            i{
            font-size: 4rem;
            }
        }
    }
    &__text{
        display: flex;
        flex-direction: column;
        h2{
            margin-bottom: 0.5rem;
        }
        button{
            margin-top:0.5rem ;
        }
    }
}
</style>