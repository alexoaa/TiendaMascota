<template>
  <AppHeader />
  <router-view></router-view>
  <!-- Auth Section -->
  <AppAuth />
</template>

<script>
import AppHeader from '@/components/AppHeader.vue';
import AppAuth from '@/components/authentication/AppAuth.vue';
export default {
  name: 'App',
  components: {
    AppAuth,
    AppHeader,
  },
};
</script>
