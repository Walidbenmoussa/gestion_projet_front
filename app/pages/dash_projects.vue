<template>
  <UHeader title="Mes Projets" :toggle="false">
     <template #right>
      <UButton icon="i-mingcute-add-fill" color="info" @click="$router.push('/new_project')" />
    </template>
  </UHeader>

  <UPageGrid class="p-6">
    <UCard class="w-sm" v-for="p in projects">
      <template #header>
        <div class="flex flex-row justify-between">
          <h1>{{ p.nom }}</h1>
          <div class="flex flex-col justify-self-end gap-2">
            <UBadge :label="p.statut" :color="couleur_statut(p.statut)" />
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-2">
        <div class="flex flex-row gap-2">
          <h3>Priorité :</h3>
          <UBadge :label="p.priorite" :color="couleur_priorite(p.priorite)" variant="outline" />
        </div>
        <h4>Date dèbut : {{new Date(p.date_debut).toLocaleDateString() }}</h4>

        <h4>Date fin : {{new Date(p.date_fin).toLocaleDateString() }}</h4>

        <UAccordion label="description" class="text-xs" :items="[{ 'label': 'description', 'icon': 'i-lucide-eye' }]">
          <template #content>
            {{ p.description }}
          </template>
        </UAccordion>
      </div>
      <template #footer>
        <div class="flex flex-row gap-2">
          <UButton  icon="i-lucide-folder" color="primary" class="flex-1" block
            @click="$router.push(`dash_project/${p.id}`)" />
          <UButton  icon="i-lucide-edit" color="warning" class="flex-1" block
            @click="$router.push(`edit_project${p.id}`)" />
          <UButton  icon="i-lucide-trash" color="error" class="flex-1" block
            @click="delete_function(p)" />
          <UButton icon="i-lucide-users" color="info" class="flex-1" block
          @click="$router.push(`team/${p.id}`)"
           />
        </div>
      </template>
    </UCard>
  </UPageGrid>


  <UConfirmation v-model="Mdelete" msg_annulation="Annuler" msg_confirmation="Confirmer"
    :msg_body="'Confirmer la suppression du projet: ' + delete_project?.nom" @confirmation="sumbit_delete">
  </UConfirmation>


</template>

<script lang="ts" setup>
import { json } from 'zod';
import type { Project } from '~/types';

const IP = useCookie('IP')
const Mdelete = ref(false)
const delete_project = ref<Project>()
const toast = useToast()

const { data: projects ,execute, clear } = useFetch<Project[]>(`${IP.value}/projects`, {
  credentials: 'include'
})

function couleur_priorite(pr: string) {
  const value_couleur = { 'Faible': 'neutral', 'Importante': 'secondary', 'Urgente': 'warning', 'Critique': 'error' }
  return value_couleur[pr]
}

function couleur_statut(statut: string) {

  const couleur_st = { 'Planifié': 'info', 'En cours': 'success', 'Suspendu': 'warning', 'Abandonné': 'neutral', 'Terminé': 'neutral' }
  return couleur_st[statut]


}

function delete_function(p: Project) {
  delete_project.value = p
  Mdelete.value = true
}

const sumbit_delete = async () => {
  Mdelete.value = false
  try {
    const response =await  $fetch(`${IP.value}/project/${delete_project.value.id}`, {
      method:'delete',
      credentials: 'include'
    })
    toast.add({ description: response, class: 'bg-green-500' ,progress:false})
    projects.value=projects.value.filter(p=>(p.id !==delete_project.value.id))
  }
  catch(errors){
    if (errors)
            toast.add({
                description: Array.isArray(errors.data.detail)
                    ? errors.data.detail.join('\n') // Affichage multi-ligne
                    : errors.data.detail || "Echec de modification", color: 'error', progress: false, class: 'bg-error whitespace-pre-line !text-white'
            })

  }
  
}


</script>

<style></style>
