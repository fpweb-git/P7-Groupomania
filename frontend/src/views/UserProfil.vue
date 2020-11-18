<template>
	<div class="user-profil">
		<ModifyUserForm/>
		<UserPosts/>
	</div>
</template>

<script>

import ModifyUserForm from "@/components/ModifyUserForm.vue";
import UserPosts from "@/components/UserPosts.vue";

export default {
	components: {
		ModifyUserForm,
		UserPosts,
	},
};
</script>

