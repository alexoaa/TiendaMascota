<template>
  <div class="fixed z-10 inset-0 overflow-y-auto modal" id="modal">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-16 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-gray-800 opacity-75"></div>
      </div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[700px] h-[500px]"
      >
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="py-5 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">Tu Cuenta</p>

            <!-- Modal Close Button -->
            <div
              class="modal-close cursor-pointer z-50"
              @click="this.authModalStore.visbleAdoptar = !this.authModalStore.visbleAdoptar"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>
          <div class="w-10/12 h-72 bg-slate-300 p-5 m-auto mb-10 overflow-hidden datos">
            <img src="@/assets/images/perro.jpg" alt="animalImg" class="w-20 h-20 m-2" />
            <li v-for="(value, key) in this.dataAnimal" :key="key">
              <div class="container-dato">
                <ul>
                  <li>
                    <span
                      ><b>{{ key }}:</b> {{ value }}
                    </span>
                  </li>
                </ul>
              </div>
            </li>
          </div>
          <!-- Tabs -->
          <ul class="flex flex-wrap mb-4 justify-around">
            <button
              class="inline-flex items-center justify-center p-2 w-32 bg-red-400 hover:bg-red-500 text-gray-800 text-sm font-medium rounded-md"
              @click="this.authModalStore.visbleAdoptar = !this.authModalStore.visbleAdoptar"
            >
              Atras
            </button>
            <button
              class="inline-flex items-center justify-center p-2 w-32 bg-orange-400 hover:bg-orange-500 text-gray-800 text-sm font-medium rounded-md"
              @click="adoptar"
            >
              <i class="fa-solid fa-paw mr-1"></i>
              Adoptar
            </button>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import useAuthModalStore from '@/stores/authModal';
import axios from 'axios';

export default {
  name: 'AdoptarModal',
  date() {
    return {
      visible: false,
      confirmAdopcion: false,
    };
  },
  props: {
    dataAnimal: Object,
  },
  methods: {
    async adoptar(event) {
      console.log(this.dataAnimal.id_mascota);
      try {
        const response = await axios.delete(
          `http://localhost:5600/eliminar-animal?idMascota=${this.dataAnimal.id_mascota}`
        );
        if (response.status === 200) {
          this.authModalStore.visbleAdoptar = !this.authModalStore.visbleAdoptar;
        }
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    ...mapStores(useAuthModalStore),
  },
};
</script>

<style scoped>
.modal {
  list-style: none;
}
.datos {
  display: flex;
  flex-wrap: wrap;
}
</style>
