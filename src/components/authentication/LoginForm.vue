<template>
  <div class="wrapper">
    <div class="form-container">
      <h1>Iniciar sesión</h1>
      <!-- Email -->
      <vee-form action="/login" class="form-cita" :validation-schema="loginSchema" @submit="login">
        <!-- Email -->
        <div class="relative my-2 w-full">
          <label class="block text-sky-600 text-lg">Correo electronico</label>
          <div class="relative my-1.5 flex items-center w-full px-3 border border-solid border-slate-500 rounded">
            <vee-field
              type="email"
              name="email"
              placeholder="Correo electronico..."
              class="leading-8 py-2.5 focus:outline-none w-full"
              autocomplete="email"
            />
          </div>
          <ErrorMessage name="email" class="text-red-600"></ErrorMessage>
        </div>

        <!-- With pure CSS -->
        <!-- <div class="inputBox">
          <vee-field type="text" id="email" name="email" />
          <span>Email</span>
        </div>
        <ErrorMessage name="email" class="text-red-600"></ErrorMessage> -->

        <!-- Password -->
        <div class="relative my-2 w-full">
          <label class="block text-sky-600 text-lg">Contraseña</label>
          <div class="relative my-1.5 flex items-center w-full px-3 border border-solid border-slate-500 rounded">
            <vee-field
              :type="passFieldType"
              name="password"
              placeholder="Contraseña..."
              class="leading-8 py-2.5 focus:outline-none w-full"
            />

            <div id="togglePass" @click="togglePass()">
              <i class="fa-regular fa-eye toggle-seg-num"></i>
              <i class="fa-regular fa-eye-slash"></i>
            </div>
          </div>
          <ErrorMessage name="password" class="text-red-600"></ErrorMessage>
        </div>

        <!-- With pure CSS -->
        <!-- <div class="inputBox">
          <vee-field :type="passFieldType" id="password" name="password" />
          <span>Contraseña</span>
          <div id="togglePass" @click="togglePass()">
            <i class="fa-regular fa-eye toggle-seg-num"></i>
            <i class="fa-regular fa-eye-slash"></i>
          </div>
          <ErrorMessage name="password" class="text-red-600"></ErrorMessage>
        </div> -->

        <!-- Login button -->
        <div class="submit-container">
          <button type="submit" id="btnIngresar" class="btn-submit">Iniciar sesión</button>
          <div class="text-red-600 py-4" v-if="!this.reg_in_submission">
            <span>{{ this.reg_alert_msg }}</span>
          </div>
          <div class="form-divisor"></div>
          <a href="/password/reset">¿Olvidaste tu contraseña?</a>
        </div>
      </vee-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapStores } from 'pinia';
import useUserStore from '@/stores/user';
import useAuthModalStore from '@/stores/authModal';

export default {
  name: 'LoginForm',
  data() {
    return {
      ip: '192.168.100.22',
      passFieldType: 'password',
      loginSchema: {
        email: 'required|email',
        password: 'required',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: '',
      btn_disabled_in_submission: '',
    };
  },
  computed: {
    ...mapStores(useUserStore, useAuthModalStore),
  },
  methods: {
    login(values) {
      // Letting the user know we are logging them in.
      this.reg_in_submission = true;
      this.reg_show_alert = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'Please wait! We are logging you in.';

      //* Authenticate user and login --- refactoring needed to pass logic to user store file
      // this.userStore.authenticate(this.ip, values);
      axios
        .post(`http://${this.ip}:5600/login`, values)
        .then((res) => {
          //We'll refresh the page, this also will let us know the authentication state persists across page refreshes
          // // Auth successfull
          console.log(res.data);

          // //Instead of reloading, we will close the modal for now
          this.authModalStore.isOpen = !this.authModalStore.isOpen;
          // // window.location.reload();

          // //* Updating state and user role state
          this.userStore.userLoggedIn = true;
          if (res.data.user.role_U === 'admin') {
            this.userStore.isAdmin = true;
          }
          return;
        })
        // Handling error logging in
        .catch((error) => {
          if (error.response.status === 401) {
            console.log(error.response.data);
            this.reg_in_submission = false;
            this.reg_alert_variant = 'bg-red-500';
            this.reg_alert_msg = error.response.data;
            return;
          }
        });
    },
    togglePass() {
      this.passFieldType = this.passFieldType === 'password' ? 'text' : 'password';
    },
  },
};
</script>
