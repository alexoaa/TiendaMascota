import { defineStore } from 'pinia';
import { appConfig } from '@/includes/appConfig';
import axios from 'axios';

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
    isAdmin: false,
    idUser: '',
  }),
  actions: {
    async register(values) {
      const response = await axios.post(`http://${appConfig.ipServer}/registrar`, values);
      //* If there is an error registering the acc, return the response
      if (response.status && response.status === 400) return response;

      //* Automatic user login after successful registration
      const logInResponse = await this.authenticate({ email: values.email, password: values.password });
      return logInResponse;
    },
    async authenticate(values) {
      //* Authenticate user and login -- - refactoring needed to pass logic to this file
      const response = await axios.post(`http://${appConfig.ipServer}/login`, values);

      //* Auth successfull
      this.idUser = response.data.id;
      //!TODO - ALMACENAR EL TOKEN JWT EN EL CLIENTE

      //* Updating state and user role state
      this.userLoggedIn = true;
      if (response.data.role === 'admin') this.isAdmin = true;
      return response.data;

      //* Handling error logging in will be in login method
    },
    async signout() {
      // await signOutUser();

      this.userLoggedIn = false;
      window.location.reload();
    },
  },
});
