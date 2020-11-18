<template>
  <div class="post">
    <ReturnHome/>
    <Post/>
  </div>
</template>

<script>
import Post from '@/components/Post.vue'
import ReturnHome from "@/components/ReturnHome.vue";

export default {
  name: 'post',
  components: {
    Post,
    ReturnHome,
  }
}
</script>
