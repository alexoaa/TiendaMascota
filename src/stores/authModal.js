import { defineStore } from 'pinia';

// (id, object)
// the state object is where we can add the data, any data that you want globally avaialble to other componen should be defined there

export default defineStore('authModal', {
  state: () => ({
    isOpen: false,
    visbleComprar: false,
    visibleAdoptar: false,
    ip: 'localhost',
  }),
});
