<template>
  <div class="wrapper">
    <div class="form-container">
      <h1>Registrarse</h1>
      <vee-form
        action="/register"
        class="form-cita"
        method="POST"
        :validation-schema="registerSchema"
        @submit="register"
      >
        <!-- Name -->
        <div class="relative my-2 w-full">
          <label class="block text-sky-600 text-lg">Nombre</label>
          <div class="relative my-1.5 flex items-center w-full px-3 border border-solid border-slate-500 rounded">
            <vee-field
              type="text"
              name="name"
              placeholder="Nombre..."
              class="leading-8 py-2.5 focus:outline-none w-full"
              autocomplete="on"
            />
          </div>
          <ErrorMessage name="name" class="text-red-600"></ErrorMessage>
        </div>

        <!-- Phone -->
        <div class="relative my-2 w-full">
          <label class="block text-sky-600 text-lg">Teléfono</label>
          <div class="relative my-1.5 flex items-center w-full px-3 border border-solid border-slate-500 rounded">
            <vee-field
              type="number"
              name="phone"
              placeholder="Teléfono..."
              class="leading-8 py-2.5 focus:outline-none w-full"
              autocomplete="email"
            />
          </div>
          <ErrorMessage name="phone" class="text-red-600"></ErrorMessage>
        </div>

        <!-- Email -->
        <div class="relative my-2 w-full">
          <label class="block text-sky-600 text-lg">Correo electrónico</label>
          <div class="relative my-1.5 flex items-center w-full px-3 border border-solid border-slate-500 rounded">
            <vee-field
              type="email"
              name="email"
              placeholder="Correo electrónico..."
              class="leading-8 py-2.5 focus:outline-none w-full"
              autocomplete="email"
            />
          </div>
          <ErrorMessage name="email" class="text-red-600"></ErrorMessage>
        </div>

        <!-- Password -->
        <div class="relative my-2 w-full">
          <label class="block text-sky-600 text-lg">Contraseña</label>
          <vee-field name="password" :bails="false" v-slot="{ field, errors }">
            <div class="relative my-1.5 flex items-center w-full px-3 border border-solid border-slate-500 rounded">
              <input
                :type="passFieldType"
                v-bind="field"
                placeholder="Contraseña..."
                class="leading-8 py-2.5 focus:outline-none w-full"
              />
              <div id="togglePass" @click="togglePass()">
                <i class="fa-regular fa-eye toggle-seg-num"></i>
                <i class="fa-regular fa-eye-slash"></i>
              </div>
            </div>
            <div class="text-red-600" v-for="error in errors" :key="error">
              {{ error }}
            </div>
          </vee-field>
        </div>

        <!-- Confirm Password -->
        <div class="relative my-2 w-full">
          <label class="block text-sky-600 text-lg">Confirmar contraseña</label>
          <div class="relative my-1.5 flex items-center w-full px-3 border border-solid border-slate-500 rounded">
            <vee-field
              :type="confPassFieldType"
              name="confirmPassword"
              placeholder="Confirmar contraseña..."
              class="leading-8 py-2.5 focus:outline-none w-full"
            />

            <div id="toggleConfPass" @click="togglePassConf()">
              <i class="fa-regular fa-eye toggle-seg-num"></i>
              <i class="fa-regular fa-eye-slash"></i>
            </div>
          </div>
          <ErrorMessage name="confirmPassword" class="text-red-600"></ErrorMessage>
        </div>

        <!-- ToS -->
        <div class="mb-3 pl-6">
          <vee-field type="checkbox" name="tos" id="tos" value="1" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
          <label for="tos" class="inline-block"
            >Acepto los <a href="#tos" class="text-sky-700">terminos del servicio.</a></label
          >
        </div>
        <ErrorMessage name="tos" class="text-red-600"></ErrorMessage>

        <!-- Register button -->
        <div class="submit-container">
          <button type="submit" id="btnRegistrar" class="btn-submit">Registrarse</button>
          <div class="text-red-600 py-4" v-if="!this.reg_in_submission">
            <span>{{ this.reg_alert_msg }}</span>
          </div>
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
  name: 'RegisterForm',
  data() {
    return {
      // ip: '192.168.100.22',
      ip: '192.168.184.252',
      // ip: 'localhost',
      passFieldType: 'password',
      confPassFieldType: 'password',
      registerSchema: {
        name: 'required|alphaSpaces|min:3|max:100',
        phone: 'required|integer|min:10|max:10',
        email: 'required|email',
        password: 'required|min:9|excluded:password',
        confirmPassword: 'passwords_mismatch:@password',
        tos: 'tos',
      },
    };
  },
  computed: {
    ...mapStores(useUserStore, useAuthModalStore),
  },
  methods: {
    register(values) {
      axios
        .post(`http://${this.ip}:5600/registrar`, values)
        .then((res) => {
          //We'll refresh the page, this also will let us know the authentication state persists across page refreshes
          // // Auth successfull
          if (res.status !== 200) return console.log('res.status different that 200 -->' + res.status);
          console.log(res.data);
          // this.userStore.idUser = res.data.userToken._id;
          // AUTOMATIC USER LOGIN AFTER SUCCESSFUL REGISTRATION
          axios.post(`http://${this.ip}:5600/login`, { email: values.email, password: values.password }).then((res) => {
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
          });
        })
        // Handling error logging in
        .catch((error) => {
          console.log(error);
          if (error.response.status && error.response.status === 400) {
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
    togglePassConf() {
      this.confPassFieldType = this.confPassFieldType === 'text' ? 'password' : 'text';
    },
  },
};
</script>
