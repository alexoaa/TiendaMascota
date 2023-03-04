import { defineStore } from 'pinia';
import axios from 'axios';

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
    async authenticate(ip, values) {
      //* Authenticate user and login -- - refactoring needed to pass logic to this file
      // await axios
      //   .post(`http://${ip}:5600/login`, values)
      //   .then((res) => {
      //     //We'll refresh the page, this also will let us know the authentication state persists across page refreshes
      //     console.log(res);
      //     return res;
      //   })
      //   // Handling error logging in
      //   .catch((error) => {
      //     return { error };
      //   });
    },
    async signout() {
      // await signOutUser();

      this.userLoggedIn = false;
      window.location.reload();
    },
  },
});
