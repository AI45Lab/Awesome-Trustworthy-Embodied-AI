<template>
  <v-app>
    <ProjectPage />
  </v-app>
</template>

<script>
import ProjectPage from './views/ProjectPage.vue';

export default {
  name: 'App',
  components: {
    ProjectPage,
  },
};
</script>

<style>
/* 可以放一些全局CSS或者留空 */
</style>