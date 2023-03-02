<template>
  <!-- class="header-sidebar" -->
  <header
    class="bg-stone-400 encoded-sans font-semibold tracking-wide text-neutral-800 relative z-1"
  >
    <ul class="flex flex-wrap justify-around items-center h-20">
      <li>
        <router-link
          :to="{ name: 'home' }"
          tabindex="0"
          exact-active-class="no-active"
          class="flex items-center text-3xl"
          >CRUELLOS <img src="@/assets/images/paw.png" alt="Cruellos" class="h-12 w-12 ml-2"
        /></router-link>
      </li>
      <div class="flex flex-wrap w-1/4 justify-around">
        <li v-if="!userStore.userLoggedIn">
          <a href="#" @click.prevent="toggleAuthModal">Iniciar Sesion / Registrarse</a>
        </li>
        <template v-else>
          <li v-if="userStore.isAdmin">
            <router-link class="px-2" :to="{ name: 'admin' }">Admin</router-link>
          </li>
          <li>
            <a class="px-2" href="#" @click.prevent="signOut">Cerrar sesión</a>
          </li>
        </template>
      </div>
    </ul>
  </header>
</template>

<script>
import { mapStores } from 'pinia';
import useAuthModalStore from '@/stores/authModal';
import useUserStore from '@/stores/user';

export default {
  name: 'AppHeader',
  components: {},
  data() {
    return {};
  },
  computed: {
    // ...mapWritableState(useModalStore, ['isOpen']),
    ...mapStores(useAuthModalStore, useUserStore),
  },
  methods: {
    toggleAuthModal() {
      this.authModalStore.isOpen = !this.authModalStore.isOpen;
    },
    signOut() {
      this.userStore.signout();
    },
    togl() {
      console.log('a');
    },
  },
};
</script>

<style>
/* Animating enter/leave frame for the SideBar  */
/* .slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-active {
  transition: transform 0.4s;
}
.slide-leave-to {
  transition: transform 0.4s;
  transform: translateX(-100%);
} */
/* Override animate class and duration */
.animate__animated {
  animation-duration: 0.4s;
}
</style>
