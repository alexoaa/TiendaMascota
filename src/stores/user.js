import { defineStore } from 'pinia';
import axios from 'axios';
import { appConfig } from '@/includes/appConfig';

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
    isAdmin: false,
    idUser: '',
  }),
  actions: {
    async register(values) {
      //* Authenticating

      //*Adding data

      //* Function to log the userCredentials since it's async

      //* Updating state
      this.userLoggedIn = true;
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
