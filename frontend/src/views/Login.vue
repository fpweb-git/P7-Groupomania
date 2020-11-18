<template>
	<div class="login" @keyup.enter="login()">
    <h2>Se connecter</h2>

    <div v-if="serverError">
        <el-alert
          :title="serverError"
          type="error"
          show-icon>
        </el-alert>
    </div>

		<el-form status-icon>
			<el-form-item label="Email" label-position="top">
				<el-input
					type="text"
					v-model="email"
				></el-input>
			</el-form-item>
			<el-form-item label="Mot de passe" label-position="top">
				<el-input
					type="password"
					v-model="password"
					autocomplete="off"
				></el-input>
			</el-form-item>
				<el-button type="primary" @click="login()" :disabled="email.length == 0 || password.length < 6"
					>Envoyer</el-button
				>
		</el-form>
	</div>
</template>

<script>
  export default {
    data() {
      return {
          email: '',
          password: '',
          serverError: '',
      };
    },
    methods: {
      login() {
            this.$store.dispatch('retrieveToken', {
              email: this.email,
              password: this.password,
            })
            .then(()=>{
              this.$router.push('/')
            })
            .catch(error =>{
              console.log(error.response)
              this.serverError = error.response.data.error
              this.password = ""
            })
          } 
      },
    }
</script>

<style lang="scss" scoped>
h2{
  margin-bottom: 30px;
}
.login{
  width: 500px;
  margin: 100px auto;
}
.el-form-item__content{
  margin: none!important;
}
.el-button{
  margin-top: 50px;
}

@media only screen and (max-width: 520px){
	.login {
	width: 400px;
	}
}
@media only screen and (max-width: 440px){
	.login{
	width: 300px;
	}
}
</style>