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
import { mapStores } from 'pinia';
import useUserStore from '@/stores/user';
import useAuthModalStore from '@/stores/authModal';

export default {
  name: 'RegisterForm',
  data() {
    return {
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
    async register(values) {
      // Letting the user know we are registerong and logging them in.
      this.reg_in_submission = true;
      this.reg_show_alert = true;
      this.reg_alert_variant = 'bg-blue-500';
      this.reg_alert_msg = 'Por favor espera mientras te creamos tu cuenta.';

      // Register and authenticate user
      try {
        const response = await this.userStore.register(values);

        // Instead of reloading, we will close the modal for now
        this.authModalStore.isOpen = !this.authModalStore.isOpen;

        //?Reload to close the modal
        //?window.location.reload();

        console.log(response);
      } catch (error) {
        // Handling error registering and logging in
        console.log(error);
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        this.reg_alert_msg = error.response.data;
        return;
      }
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
