<template>
  <div class="p-5 pb-3 main relative">
    <section class="aside">
      <div class="catalogo">
        <h2>Catálogo</h2>
        <ul>
          <li>
            <a href="#" @click.prevent="consultarCatalogo" data-value="Perro">Perros</a>
          </li>
          <li><a href="#" @click.prevent="consultarCatalogo" data-value="Gato">Gatos</a></li>
          <li><a href="#" @click.prevent="consultarCatalogo" data-value="Otro">Otros</a></li>
        </ul>
      </div>
      <!-- <div class="filtro catalogo ">
        <h2>Filtros</h2>
        <div>
          <input type="checkbox" v-model="showVenta" value="Venta" />
          <label for="venta">Venta</label>
        </div>
        <div>
          <input type="checkbox" v-model="showAdopcion" value="Adopcion" />
          <label for="adopcion">Adopcion</label>
        </div>
        <button
          class="inline-flex items-center px-4 py-2 my-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md"
          @click="filtrarDatos"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
          Filtrar
        </button>
      </div> -->
    </section>
    <section class="catalogo-datos mx-auto">
      <div>
        <ul>
          <li v-for="animal in animales" :key="animal.id_mascota">
            <div class="container-dato">
              <img src="@/assets/images/perro.jpg" alt="animalImg" />
              <ul>
                <li>
                  <span><b>Especie:</b> {{ animal.especie }} </span>
                </li>
                <li>
                  <span><b>Nombre:</b> {{ animal.nombre }} </span>
                </li>
                <li>
                  <span><b>Edad:</b> {{ animal.edad }} </span>
                </li>
                <li>
                  <span><b>Raza:</b> {{ animal.raza }} </span>
                </li>
                <li>
                  <span><b>Tamaño:</b> {{ animal.tamano }} </span>
                </li>
                <li>
                  <span><b>Esterilizado:</b> {{ animal.esterilizado }} </span>
                </li>
                <li>
                  <span><b>Vacunas:</b> {{ animal.vacunas }} </span>
                </li>
                <li>
                  <span><b>Tipo:</b> {{ animal.tipo }} </span>
                </li>
                <li v-if="animal.tipo === 'Venta'">
                  <span><b>Precio:</b> {{ animal.precio }} </span>
                </li>
              </ul>
              <button
                class="inline-flex items-center justify-center p-2 w-32 ml- bg-green-400 hover:bg-green-600 text-gray-800 text-sm font-medium rounded-md"
                v-if="animal.tipo === 'Adopcion' && this.userStore.userLoggedIn === true"
                @click="adoptar(animal)"
              >
                <i class="fa-solid fa-paw mr-1"></i>
                Adoptar
              </button>
              <button
                v-else-if="this.userStore.userLoggedIn === true"
                class="inline-flex items-center justify-center p-2 w-32 bg-orange-400 hover:bg-orange-500 text-gray-800 text-sm font-medium rounded-md"
                @click="comprar(animal)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Comprar
              </button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
  <AdoptarModal v-if="this.authModalStore.visbleAdoptar" :dataAnimal="animalElegido" />
  <ComprarModal v-if="this.authModalStore.visbleComprar" :dataAnimal="animalElegido" />
</template>

<script>
//   import AppAuth from '@/components/authentication/AppAuth.vue'
// import perroImg from '@/assets/images/perro.jpg';
import axios from 'axios';
import AdoptarModal from '@/components/AdoptarModal.vue';
import ComprarModal from '@/components/ComprarModal.vue';
import { mapStores } from 'pinia';
import useAuthModalStore from '@/stores/authModal';
import useUserStore from '@/stores/user';

export default {
  name: 'MainView',
  components: {
    ComprarModal,
    AdoptarModal,
  },
  data() {
    return {
      opcion: '',
      catalogo: [],
      showVenta: false,
      showAdopcion: false,
      animalElegido: {},
      // ip: '192.168.100.22',
      // ip: 'localhost',
      ip: '192.168.184.252',
    };
  },
  computed: {
    animales() {
      return this.catalogo.map((item) => ({
        id_mascota: item.id_mascota,
        nombre: item.nombre,
        tamaño: item.tamaño,
        edad: item.edad,
        raza: item.raza,
        genero: item.genero,
        esterilizado: item.esterilizado ? 'Si' : 'No',
        vacunas: item.vacunas ? 'Si' : 'No',
        tipo: item.tipo,
        precio: item.precio,
      }));
    },
    ...mapStores(useAuthModalStore, useUserStore),
    isSelectedClass() {
      return 2 + 2;
    },
  },
  methods: {
    async consultarCatalogo(event) {
      try {
        this.opcion = event.target.dataset.value;
        const response = await axios.get(`http://${this.ip}:5600/consultar-catalogo?especie=${this.opcion}`);
        this.catalogo = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async filtrarDatos() {
      let url = ``;
      if (!this.showAdopcion && !this.showVenta) {
        console.log(this.showAdopcion);
        console.log(this.showVenta);
        return;
      }
      if (this.showVenta && !this.showAdopcion) {
        url = `http://${this.ip}:5600/consultar-catalogo?tipo=Venta`;
      } else if (this.showAdopcion && !this.showVenta) {
        url = `http://${this.ip}:5600/consultar-catalogo?tipo=Adopcion`;
      } else if (this.showAdopcion && this.showVenta) {
        url = `http://${this.ip}:5600/consultar-catalogo?tipo=Adopcion&tipo=Venta`;
      }
      try {
        const response = await axios.get(url);
        console.log(response.data);
        this.catalogo = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async comprar(elegido) {
      this.authModalStore.visbleComprar = !this.authModalStore.visbleComprar;
      this.animalElegido = elegido;
      console.log(elegido);
    },
    async adoptar(elegido) {
      this.authModalStore.visbleAdoptar = !this.authModalStore.visbleAdoptar;
      this.animalElegido = elegido;
      console.log(elegido);
    },
  },
};
</script>

<style scoped>
.main {
  max-height: 70vh;
  min-height: 70vh;
  overflow: hidden;
  color: #333;
  display: flex;
}
.aside {
  width: 20%;
  text-align: center;
  display: inline-block;
}
.filtro {
  margin-top: 3rem;
}
.filtro div {
  display: flex;
  padding: 15px 30px;
}
.filtro div input {
  display: inline-block;
  margin-right: 20px;
}
.filtro div input:hover {
  cursor: pointer;
}
.catalogo {
  width: 15rem;
  border: 2px solid var(--border-color);
  font-weight: 600;
  text-align: center;
  max-height: 280px;
  display: inline-block;
}
.catalogo h2 {
  border-bottom: 2px solid var(--border-color);
  padding: 15px 0;
  font-size: 1.7rem;
}
.catalogo ul li a {
  display: inline-block;
  width: 100%;
  padding: 10px 0;
}
.catalogo ul li {
  border-bottom: 2px solid var(--border-color);
}
.catalogo ul li:last-child {
  border-bottom: none;
}
.catalogo ul li a:hover {
  opacity: 0.5;
}
.catalogo ul li a:active {
  opacity: 0.5;
}
.catalogo-datos {
  width: 70%;
  display: inline-block;
  border: 2px solid var(--border-color);
  max-height: 60%;
  overflow-y: auto;
}
.container-dato {
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 10px 20px;
  justify-content: space-around;
}
.container-dato img {
  width: 100px;
  height: 100px;
  background-color: var(--border-color);
  margin: 0 30px;
}
.container-dato ul {
  display: flex;
  flex-wrap: wrap;
  width: 55%;
}
.container-dato ul li {
  display: flex;
  margin: 5px;
  font-size: 1.2rem;
}
</style>
