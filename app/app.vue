<template>
  <UApp :locale="fr">
    <NuxtLayout>
      <UMain>
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>


<script setup lang="ts">
import { fr } from '@nuxt/ui/locale'
const IP = useCookie('IP')
IP.value = 'https://gestion-projet-vgog.onrender.com'
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'fr'
  }
})

</script>
