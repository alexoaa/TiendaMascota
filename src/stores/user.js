import { defineStore } from 'pinia';

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
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
      //* Authenticate user and login --- refactoring needed to pass logic to this file
      // await authenticateUser(values.email, values.password);
      console.log(values);
      //* Updating state
      this.userLoggedIn = true;
    },
    async signout() {
      // await signOutUser();

      this.userLoggedIn = false;
      window.location.reload();
    },
  },
});
