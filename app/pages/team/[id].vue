<template>
  <UHeader :title="team.project.nom">
    <template #right>
      <UButton icon="i-lucide-plus" color="info" @click="Madd = true" />
    </template>
  </UHeader>

  <UMarquee :overlay="false">
    <UUser :name="team.creator.prenom + ' ' + team.creator.nom" description="Administrateur" />
    <h4>Priorité
      <UBadge :label="team.project.priorite" variant="outline" />
    </h4>
    <h4>Début {{ team.project.date_debut }}</h4>
    <h4>Fin {{ team.project.date_fin }}</h4>
    <UAccordion label="description" class="text-xs" :items="[{ 'label': 'description', 'icon': 'i-lucide-eye' }]">
      <template #content>
        {{ team.project.description }}
      </template>
    </UAccordion>
  </UMarquee>

  <UMain class="pt-8">

    <UCard>
      <template #header>
        <div class="flex flex-row  justify-between">
          <h1>Equipe du projet</h1>
          <UButton icon="i-lucide-plus" color="success" @click="Madd = true" />
        </div>
      </template>

      <div v-for="u in team?.team">
        <div class="flex flex-row space-x-4 self-end">
          <UUser :name="u.nom + ' ' + u.prenom" class="w-full" />
          <USelect v-model="u.poste" :items="['Admin', 'Chef de projet', 'Developpeur', 'Membre', 'Aucun']"
            class="w-full" @change="edit_poste(u)">
          </USelect>
          <UButton @click="delete_user(u)" icon="i-lucide-trash-2" class="flex-1" color="warning" />
        </div>
      </div>
    </UCard>
  </UMain>

  <!-- Modale ajouter user-->
  <UModal v-model:open="Madd" class="h-fit">
    <template #header>Ajouté des collaborateurs</template>

    <template #body>
      <UCheckboxGroup variant="card" v-model="new_membres" :items="team.reste.map(u => (
        {
          'label': u.nom + ' ' + u.prenom,
          'value': u.id
        }
      ))" />


    </template>

    <template #footer="{ close }">
      <UButton label="Confirmer l'ajout" color="primary" block @click="submit_add" />
      <UButton label="Annuler" color="error" block @click="close" />
    </template>


  </UModal>


  <!-- Modale Modifier poste user-->

  <UModal v-model:open="Mposte" v-if="user_edit" :dismissible=false>
    <template #header>
      <h1>Confirmer le changement de poste de {{ user_edit.nom }} </h1>
    </template>
    <template #body>

      <h2>Ancien Poste : {{data_team.team.find(u => (u.id == user_edit.id)).poste}}</h2>
      <h2>Nouveau Poste : {{ user_edit.poste }}</h2>
    </template>


    <template #footer>
      <UButton label="Confirmer le changement" color="primary" block @click="submit_poste" />
      <UButton label="Annuler" color="error" block @click="close_poste" />
    </template>
  </UModal>
  <h1>{{ new_membres }}</h1>

</template>

<script lang="ts" setup>
import type { Teams, User } from '~/types';

const IP = useCookie('IP')
const toast = useToast()
const project_id = useRoute().params.id
const team = ref<Teams>()


const user_edit = ref<User>()
const Mposte = ref(false)


const Madd = ref(false)
const new_membres = ref([])



const { data: data_team, execute, clear } = await useFetch<Teams>(`${IP.value}/team/${project_id}`,
  { credentials: 'include' })

team.value = structuredClone(data_team.value)



const delete_user = async (u: User) => {
  try {
   
    const response = await $fetch(`${IP.value}/delete_team`, {
      method: 'post',
      credentials: 'include',
      body: {id_project:project_id , id_user:u.id}
    })
    toast.add({ description: response, color: 'primary', progress: false, class: 'bg-primary' })


  }
  catch (errors) {
  

    if (errors)
      toast.add({
        description: Array.isArray(errors.data.detail)
          ? errors.data.detail.join('\n') // Affichage multi-ligne
          : errors.data.detail || "Echec de modification", color: 'error', progress: false, class: 'bg-error whitespace-pre-line !text-white'
      })
  }
  finally{
    await execute()
    team.value = structuredClone(data_team.value)
  }
}


const submit_add = async () => {

  try {
  
    const response = await $fetch(`${IP.value}/update_team/${project_id}`, {
      method: 'patch',
      credentials: 'include',
      body: new_membres.value
    })
    toast.add({ description: response, color: 'primary', progress: false, class: 'bg-primary' })
    await execute()
    team.value=structuredClone(data_team.value)

  }

  catch (errors) {

    if (errors) {
      toast.add({
        description: Array.isArray(errors.data.detail)
          ? errors.data.detail.join('\n') // Affichage multi-ligne
          : errors.data.detail || "Echec de modification", color: 'error', progress: false, class: 'bg-error whitespace-pre-line !text-white'
      })
    }

  }finally{
        Madd.value=false
        new_membres.value=[]

  }

}






const close_poste = () => {
  Mposte.value = false
  team.value = structuredClone(data_team.value)

}

const edit_poste = (u: User) => {
  const old_poste = data_team.value.team.find(u_old => (u_old.id == u.id)).poste
    
  if (u.poste !== old_poste) {

    user_edit.value = { ...u }
    Mposte.value = true
  }

}

const submit_poste = async () => {
  try {
    const response = await $fetch(`${IP.value}/update_poste`, {
      method: 'patch',
      credentials: 'include',
      body: { 'id_user': user_edit.value.id, 'id_project': project_id, 'poste': user_edit.value.poste }
    })

    toast.add({ description: response, color: 'primary', progress: false, class: 'bg-primary' })
    Mposte.value = false
    execute()

  }


  catch (errors) {
    Mposte.value = false
    team.value = structuredClone(data_team.value)


    if (errors) {
      toast.add({
        description: Array.isArray(errors.data.detail)
          ? errors.data.detail.join('\n') // Affichage multi-ligne
          : errors.data.detail || "Echec de modification", color: 'error', progress: false, class: 'bg-error whitespace-pre-line !text-white'
      })
    }

  }

}

</script>
