<template>
	<div class="user-profil">
		<UserHeader/>
		<UserPosts/>
	</div>
</template>

<script>
import UserHeader from "@/components/UserHeader.vue";
import UserPosts from "@/components/UserPosts.vue";

export default {
	name: "UserPage",
	components: {
	UserHeader,
	UserPosts,
	},
};
</script>

