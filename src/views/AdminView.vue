<template>
  <div class="w-full h-max text-center p-4 relative">
    <div class="w-full flex text-left justify-end">
      <span class="border-r-[1px] border-black mr-2 px-2">Octavio Alejandro Olvera Alexander</span>
      <span>03-Marzo-2023 19:25:04</span>
    </div>
    <div class="flex py-4">
      <aside class="aside">
        <ul>
          <li>
            <a href="#" @click.prevent="this.openAdminSection = 'ActivityLog'"> Registro de actividades </a>
          </li>
          <!-- <li>
            <a href="#" @click.prevent="this.openAdminSection = 'ManageMascota'"> Añadir mascota </a>
          </li>
          <li>
            <a href="#" @click.prevent="this.openAdminSection = 'ManageMascota'"> Manejar </a>
          </li> -->
        </ul>
      </aside>
      <component :is="openAdminSection"></component>
    </div>
  </div>
</template>

<script>
import ActivityLog from '@/components/ActivityLog.vue';
import ManageMascota from '@/components/ManageMascota.vue';

export default {
  name: 'AdminView',
  data() {
    return {
      openAdminSection: 'ActivityLog',
    };
  },
  computed: {},
  components: {
    ActivityLog,
    ManageMascota,
  },
  methods: {},
};
</script>

<style scoped>
.aside {
  width: 15rem;
  border: 2px solid var(--border-color);
  font-weight: 600;
  text-align: center;
  max-height: 280px;
  margin-right: 2em;
  display: inline-block;
}
.aside ul li {
  display: inline-block;
  width: 100%;
  padding: 10px 0;
  border-bottom: 2px solid var(--border-color);
}
.aside ul li:hover {
  opacity: 0.5;
  cursor: pointer;
}
</style>
