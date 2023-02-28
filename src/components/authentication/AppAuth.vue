<template>
  <div v-if="modalVisibility" class="fixed z-10 inset-0 overflow-y-auto" id="modal">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-16 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-5 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Tu Cuenta</p>

            <!-- Modal Close Button -->
            <div class="modal-close cursor-pointer z-50" @click="modalVisibility = false">
              <i class="fas fa-times"></i>
            </div>
          </div>

          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                @click.prevent="tab = 'login'"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'login',
                  'hover:text-blue-600': tab === 'register'
                }"
                >Iniciar Sesión</a
              >
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                href="#"
                @click.prevent="tab = 'register'"
                :class="{
                  'hover:text-white text-white bg-blue-600': tab === 'register',
                  'hover:text-blue-600': tab === 'login'
                }"
                >Registrarse</a
              >
            </li>
          </ul>

          <!-- The submit event will do 2 things, it'll enforce the validation before running the function we have in the expression. If the validation fails in any of the fields, it will not run the expression.
          Secondly, it'll prevent the page from refreshing when the form is submitted. -->

          <!-- Login Form -->
          <AuthLoginForm v-if="tab === 'login'"></AuthLoginForm>

          <!-- Registration Form -->
          <AuthRegisterForm v-else></AuthRegisterForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia';
import useAuthModalStore from '@/stores/authModal';
import AuthLoginForm from './LoginForm.vue';
import AuthRegisterForm from './RegisterForm.vue';

export default {
  name: 'AppAuth',
  components: {
    AuthLoginForm,
    AuthRegisterForm
  },
  data() {
    return {
      tab: 'login'
    };
  },
  computed: {
    ...mapWritableState(useAuthModalStore, { modalVisibility: 'isOpen' })
  }
};
</script>
