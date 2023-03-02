<template>
  <div class="w-full h-max text-center p-4 relative">
    <div class="flex text-right right-5 absolute">
      <span class="border-r-[1px] border-black mr-2 px-2">Octavio Alejandro Olvera Alexander</span>
      <span>03-Marzo-2023 19:25:04</span>
    </div>
    <div class="flex">
      <aside class="aside">
        <ul>
          <li>Registro de actividades</li>
          <li>Añadir mascota</li>
          <li>Manejar</li>
        </ul>
      </aside>
      <div class="h-full bg-gray-500/[.2] border-2 border-black">
        <h1 class="p-10 text-3xl font-semibold border-b-[1px] border-black">
          Registro de actividades
        </h1>
        <div class="w-full">
          <div class="text-left border-b-[1px] border-black">
            <div class="text-left border-b-[1px] border-black py-3 px-4 font-bold text-xl">
              <i class="fa-solid fa-chevron-down pr-2"></i>
              Fecha: <span>12 Febrero 2023</span>
            </div>
            <div class="text-left border-b-[1px] border-black pl-12">
              <div class="font-semibold border-r-[1px] border-black px-3 py-2 text-sm inline-block">
                Hora:
                <span class="font-medium">Lorem ipsum</span>
              </div>
              <div class="font-semibold border-r-[1px] border-black px-3 py-2 text-sm inline-block">
                User:
                <span class="font-medium">Lorem ipsum</span>
              </div>
              <div class="font-semibold border-r-[1px] border-black px-3 py-2 text-sm inline-block">
                Accion:
                <span class="font-medium"
                  >Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, officiis vel cum
                  consectetur asperiores a la MASCOTA</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//   import AppAuth from '@/components/authentication/AppAuth.vue'

export default {
  name: 'CatalogoView',
  components: {
    //   AppAuth
  },
};
</script>
