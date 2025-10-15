<template>

  <UPage>
    
    <UCard class="mt-4">
      <template #header>
        <div class="flex flex-col">
          <UIcon class="size-10 self-center" color="primary" name="i-lucide-user" />
          <h1 class="self-center ">Nouvel Utilisateur</h1>
        </div>
      </template>
        <UFormField label='Nom'>
          <UInput v-model="user.nom" type="text" class="w-full" required />
        </UFormField>

        <UFormField label='Prenom'>
          <UInput v-model="user.prenom" type='text' class="w-full" required />
        </UFormField>

        <UFormField label='Email'>
          <UInput v-model="user.email" type="email" class="w-full" required />
        </UFormField>

        <UFormField label='Mot de passe'>
          <Upassword v-model="user.psw" type='password' class="w-full" required />
        </UFormField>
           <UFormField label='COnfirmatio mot de passe'>
          <Upassword v-model="psw_verif" type='password' class="w-full" required />
        </UFormField>
      <template #footer>
          <UButton label="Enregitrer" block class="flex-1" @click="submitUser" />
          <UButton label="Réinitialiser" block class="flex-1" color="neutral" @click="resetUser" />
      </template>

    </UCard>

  </UPage>

</template>


<script lang="ts" setup>
import type { User } from '~/types';
const IP = useCookie('IP')
const toast=useToast()
const user = ref<User>({
  nom: '',
  prenom: '',
  email: '',
  psw: ''
})

function resetUser() {
  user.value.nom = ''
  user.value.prenom = ''
  user.value.email = ''
  user.value.psw = ''
}
const psw_verif=ref('')


const submitUser = async () => {
  const response = await useFetch(`${IP.value}/user`, { method: 'POST', body: user, watch: false })
  if (response.status.value == 'error') {
    toast.add({ description:  Array.isArray(response.error.value?.data?.detail)
    ? response.error.value.data.detail.join('\n') // Affichage multi-ligne
    : response.error.value?.data?.detail ||"Probleme de connexion", color: 'error', progress: false, class: 'bg-error whitespace-pre-line !text-white' })
  }

  if (response.status.value == 'success') {

    useRouter().push('/')
  }
}


</script>
