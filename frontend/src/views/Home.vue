<template>
  <div class="home">
    <CreatePost/>
    <Posts/>
  </div>
</template>

<script>
import Posts from '@/components/Posts.vue'
import CreatePost from "@/components/CreatePost.vue";

export default {
  name: 'Home',
  components: {
    Posts,
    CreatePost,
  },
  mounted(){
    const token = localStorage.getItem("access_token")
    if(token === null){
      this.$router.push("/login")
    }
  }
}
</script>

<style lang="scss">
.home{
  padding: 20px 0;
}
</style>