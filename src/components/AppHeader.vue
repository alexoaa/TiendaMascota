<template>
  <!-- class="header-sidebar" -->
  <header class="bg-stone-400 encoded-sans font-semibold tracking-wide text-neutral-800 relative z-1">
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
            <a class="px-2" href="#" @click.prevent="logOut">Cerrar sesión</a>
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
import axios from 'axios';

export default {
  name: 'AppHeader',
  components: {},
  data() {
    return {
      // ip: '192.168.100.22',
      ip: '192.168.184.252',
      // ip: 'localhost',
    };
  },
  computed: {
    // ...mapWritableState(useModalStore, ['isOpen']),
    ...mapStores(useAuthModalStore, useUserStore),
  },
  methods: {
    toggleAuthModal() {
      this.authModalStore.isOpen = !this.authModalStore.isOpen;
    },
    logOut() {
      window.location.reload();
      // axios
      //   .delete(`http://${this.ip}:5600/logout`)
      //   .then((req) => {
      //     if (req.status === 200) {
      //       this.userStore.userLoggedIn = false;
      //       this.userStore.isAdmin = false;
      //       window.location.reload();
      //     } else {
      //       console.log(req.data);
      //     }
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
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
