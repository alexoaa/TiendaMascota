<template>
  <div class="h-full w-full bg-gray-500/[.2] border-2 border-black">
    <h1 class="p-10 text-3xl font-semibold border-b-[1px] border-black">Registro de actividades</h1>
    <div class="w-full">
      <div
        class="w-full border-b-[1px] border-black flex"
        id="fecha"
        v-for="registro in registros"
        :key="registro.idRegistro"
      >
        <div class="text-left px-2 flex">
          <div class="item-registro w-40">
            Fecha: <span>{{ registro.fecha }}</span>
          </div>
          <div class="item-registro w-56">
            Id registro:
            <span class="font-medium">{{ registro.idRegistro }}</span>
          </div>
          <div class="item-registro w-32">
            Hora:
            <span class="font-medium">{{ registro.hora }}</span>
          </div>
          <div class="item-registro w-80">
            User:
            <span class="font-medium">{{ registro.idUser }}_ {{ registro.nombreUser }}</span>
          </div>
          <div class="item-registro w-[34rem]">
            Accion:
            <span class="font-medium">{{ registro.accion }} {{ registro.idMascota }}_</span>
            <!-- {{ registro.nombreMascota }} -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import useUserStore from '@/stores/user';
import axios from 'axios';

export default {
  name: 'ActivityLog',
  data() {
    return {
      // ip: '192.168.100.22',
      ip: '192.168.184.252',
      // ip: 'localhost',
      registros: [],
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  async beforeMount() {
    axios
      .get(`http://${this.ip}:5600/activity-log`)
      .then((res) => {
        console.log(res.data);

        res.data.forEach((registro) => {
          console.log(registro);
          this.registros.push({
            idRegistro: registro.ID_REGISTRO,
            fecha: registro.FECHA,
            hora: registro.HORA,
            idUser: registro.ID_USUARIO,
            nombreUser: registro.NOMBRE_USUARIO,
            accion: registro.ACCION,
            idMascota: registro.IdMascota,
            // nombreMascota: registro.Mascota,
          });
        });
        console.log(this.registros);
      })
      // Handling error logging in
      .catch((error) => {
        this.reg_in_submission = false;
        this.reg_alert_variant = 'bg-red-500';
        if (error) {
          console.log(error);
          this.reg_alert_msg = 'There is not an account with that email.';
          return;
        }
        this.reg_alert_msg = 'Invalid login details.';
        return;
      });
  },
};
</script>

<style scoped>
.item-registro {
  font-weight: 600;
  border-right: 1px solid #000;
  padding: 6px;
  font-size: 0.875rem;
  line-height: 1.25rem;
  /* min-width: 220px; */
  /* display: flex; */
}
</style>
