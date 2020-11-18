<template>
	<div class="register">
		<h2>Inscription</h2>
		<div class="server-error" v-if="serverError">
			<el-alert :title="serverError" type="error" show-icon> </el-alert>
		</div>
		<div v-if="successMessage">
			<el-alert :title="successMessage" type="success" show-icon> </el-alert>
		</div>
		<el-form status-icon :model="dynamicValidateForm" ref="dynamicValidateForm">
			<el-form-item
				label="Nom d'utilisateur"
				:rules="[{ required: true, message: 'Veuillez entrer un nom', trigger: 'blur' }]"
				prop="username"
			>
				<el-input
					type="text"
					maxlength="20"
					show-word-limit
					v-model="dynamicValidateForm.username"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-form-item
				label="Email"
				:rules="[
					{
						required: true,
						message: 'Veuillez entrer l\'adresse e-mail',
						trigger: 'blur',
					},
					{
						type: 'email',
						message: 'Veuillez entrer une adresse e-mail valide',
						trigger: ['blur', 'change'],
					},
				]"
				prop="email"
			>
				<el-input
					type="text"
					v-model="dynamicValidateForm.email"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-form-item
				label="Mot de passe"
				:rules="[
					{
						required: true,
						message: 'Le mot de passe de passe doit contenir au minimum 6 caractères',
						trigger: 'blur',
					},
				]"
				prop="password"
			>
				<el-input
					type="password"
					minlength="6"
					v-model="dynamicValidateForm.password"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-button
				type="primary"
				@click="register()"
				:disabled="
					dynamicValidateForm.email.length == 0 ||
						dynamicValidateForm.password.length < 6 ||
						dynamicValidateForm.username.length == 0"
				>Envoyer</el-button
			>
		</el-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			serverError: "",
			successMessage: "",
			dynamicValidateForm: {
				email: "",
				username: "",
				password: "",
			},
		};
	},
	methods: {
		register() {
			this.$store
				.dispatch("createAccount", {
					username: this.dynamicValidateForm.username,
					email: this.dynamicValidateForm.email,
					password: this.dynamicValidateForm.password,
				})
				.then((response) => {
					(this.username = ""),
						(this.email = ""),
						(this.password = ""),
						(this.successMessage = response.data.message);
					setTimeout(() => {
						this.$router.push("/login");
					}, 1500);
				})
				.catch((error) => {
					this.serverError = error.response.data.error;
					this.password = "";
				});
		},
	},
};
</script>

<style lang="scss" scoped>
h2 {
	margin-bottom: 30px;
}
.register {
	width: 500px;
	margin: 100px auto;
}
.el-form-item__content {
	margin: none !important;
}
.el-button {
	margin-top: 50px;
}

@media only screen and (max-width: 520px){
	.register {
	width: 400px;
	}
}
@media only screen and (max-width: 440px){
	.register{
	width: 300px;
	}
}
</style>
