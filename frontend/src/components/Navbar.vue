<template>
	<nav class="navbar">
		<el-menu mode="horizontal">
			<el-menu-item v-if="!loggedIn" class="nav-logo no-link">
				<div><i class="fas fa-globe"></i><span> Groupomania</span></div>
			</el-menu-item>
			<el-menu-item v-if="loggedIn" class="nav-logo">
				<router-link to="/"
					><i class="fas fa-globe"></i><span> Groupomania</span></router-link
				>
			</el-menu-item>
			<el-menu-item v-if="!loggedIn" class="nav-link">
				<router-link to="/login">Se connecter</router-link>
			</el-menu-item>
			<el-menu-item v-if="!loggedIn" class="nav-link">
				<router-link to="/register">Inscription</router-link>
			</el-menu-item>
			<el-menu-item v-if="loggedIn" class="nav-link">
				<el-dropdown trigger="click">
					<span class="el-dropdown-link"><i class="el-icon-setting"></i></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item class="dropdown-item">
							<router-link :to="{ name: 'profil', params: { id: this.$store.state.user.userId}}">Mon compte</router-link>
						</el-dropdown-item>
						<el-dropdown-item class="dropdown-item">
							<span @click="logout">Déconnexion</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-menu-item>
			<el-menu-item v-if="loggedIn" class="nav-link">
				<NavbarUser/>
			</el-menu-item>
		</el-menu>
	</nav>
</template>

<script>
import NavbarUser from "@/components/NavbarUser.vue";

export default {
	name: "Navbar",
	components: {
		NavbarUser,
	},
	computed: {
		loggedIn() {
			return this.$store.getters.loggedIn;
		},
	},
	methods: {
		logout() {
			this.$store.dispatch("logout").then(() => {
				this.$router.push("/login");
			});
		},
	},
};
</script>

<style scoped lang="scss">
span {
	font-family: Avenir, Helvetica, Arial, sans-serif;
}
a {
	text-decoration: none;
}
.nav-link {
	float: right !important;
}
.nav-logo {
	display: flex;
	justify-content: center;
	align-items: center;
	span {
		font-size: 1.2rem;
		font-weight: bold;
		color: rgb(90, 88, 102);
		margin-left: 0.5rem;
	}
	.fa-globe {
		font-size: 1.6rem;
		color: rgb(90, 88, 102);
	}
}
.no-link {
	cursor: default;
}
.el-menu-item {
	border-bottom: none !important;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 12px;
	i {
		margin-right: 0;
		font-size: 1.3rem;
	}
}
.dropdown-item{
	font-size: 0.8rem;
	font-family: Avenir, Helvetica, Arial, sans-serif;
}

@media only screen and (max-width: 520px){
	.nav-logo{
		span{
			display: none;
		}
	}
	.el-menu-item {
	i {
		font-size: 1.6rem;
	}
}
}
</style>
