<template>

    <UHeader :to="null" :title="null" :toggle="null">

    </UHeader>
    <UCard class="mt-4" >
      <template #header>
        <div class="flex flex-col">
          <UIcon class="size-10 self-center" name="i-lucide-user" />
          <h1 class="self-center">Se connecter</h1>
        </div>
      </template>
      <UFormField label='Email'>
        <UInput v-model="user.email" type="email" class="w-full" required />
      </UFormField>

      <UFormField label='Mot de passe'>
        <Upassword v-model="user.psw"  class="w-full" required />
      </UFormField>
      <template #footer>
        <UButton label="Se connecter" block class="flex-1" @click="submit" />
        <UButton label="S'inscrire" block class="flex-1" color="neutral" @click="useRouter().push('create_user')" />
      </template>
    </UCard>




</template>



<script lang="ts" setup>
import type { User } from '~/types';

const IP = useCookie('IP')

const toast = useToast()

const user = ref<User>({
  email: '',
  psw: ''
})


const submit = async () => {
  const response = await useFetch(`${IP.value}/login`, {
    method: 'POST',
    credentials: 'include',
    body: user,
    watch: false

  })
  if (response.status.value == 'error') {
    toast.add({
      description: Array.isArray(response.error.value?.data?.detail)
        ? response.error.value.data.detail.join('\n') // Affichage multi-ligne
        : response.error.value?.data?.detail || "Probleme de connexion", color: 'error', progress: false, class: 'bg-error whitespace-pre-line !text-white'
    })
  }

  if (response.status.value == 'success') {
    toast.add({ description: 'Vous ete connecté', color: 'success', progress: false, class: 'bg-success' })
    const user= useCookie('user')
    user.value = response.data.value
    useRouter().push('/')
  }

}


</script>
