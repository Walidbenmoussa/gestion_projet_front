<template>
  <UModal v-model:open="model" class="w-xs" title="Nouvelle Tache">

    <template #body="{close}">

      <UForm @submit.prevent="submitTask(close)" :state="new_task" :validate="validate_form">

        <UFormField label="Nom" name="nom">
          <UInput v-model="new_task.nom" type="text" class="w-full" />
        </UFormField>
        <UFormField label="Description" name="descriptif">
          <UTextarea v-model="new_task.descriptif" type="textarea" class="w-full" />
        </UFormField>

        <UFormField label="Date de début" name="date_debut" :eager-validation="true">
         <PopCalendar v-model="new_task.date_debut" />
        </UFormField>

        <UFormField label="Date de fin" name="date_fin" :eager-validation="true">
          <PopCalendar v-model="new_task.date_fin"/>

      
        </UFormField>

        <UFormField label="Priorité">
          <USelect v-model="new_task.priorite" :items="['Faible', 'Importante', 'Urgente', 'Critique']"
            class="w-full" />
        </UFormField>
        <UFormField label="Statut">
          <USelect v-model="new_task.statut" :items="['Planifié', 'En cours', 'Suspendu', 'Abandonné', 'Terminé']"
            class="w-full" />
        </UFormField>
        <div class="flex flex-col gap-2 mt-4">
          <UButton label="Enregitrer" block class="flex-1" type="submit" />
          <UButton label="Réinitialiser" block class="flex-1" color="neutral" @click="resetTask" />
        </div>

      </UForm>
    </template>

  </UModal>
</template>

<script lang="ts" setup>
import type { Task } from '~/types'

import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const IP = useCookie('IP')
const toast = useToast()
const today = new Date()

const model = defineModel()

const props = defineProps<{ id_project: number }>()
const emits=defineEmits(['close_success'])

const new_task = ref<Task>(
  {
    nom: undefined,
    date_debut: undefined,
    date_fin: undefined,
    statut: 'Planifié',
    priorite: 'Faible',
    descriptif: undefined,
    id_project: Number(props.id_project),
    user_id: undefined


  }
)

function resetTask() {
  new_task.value = {
    nom: undefined,
    date_debut: undefined,
    date_fin: undefined,
    statut: 'Planifié',
    priorite: 'Faible',
    descriptif: undefined,
    id_project: Number(props.id_project),
    user_id: undefined


  }

}



const validate_form = (t: Task) => {
  const errors = []

  if (!t.descriptif) {
    errors.push({ 'name': 'descriptif', 'message': 'remplir la description de la tache' })
  }
  if (!t.nom) {
    errors.push({ 'name': 'nom', 'message': 'remplir le nom de la tache' })
  }

  if (t.date_debut > t.date_fin || !t.date_debut || !t.date_fin) {
    errors.push({ 'name': 'date_debut', 'message': 'Date incohérante' }),
      errors.push({ 'name': 'date_fin', 'message': 'Date incohérante' })
  }
  return errors

}




const submitTask = async (close) => {
  
  try {
    const response = await $fetch(`${IP.value}/task`, {
      method: 'POST',
      credentials: 'include',
      body: new_task.value,
      watch: false
    })


    toast.add({ description:'Tache Ajouté avec success', color: 'primary', progress: false, class: 'bg-primary' })
    resetTask()
    close() 
    emits('close_success')

    
  }
  catch (errors) {
    if (errors)
      toast.add({
        description: Array.isArray(errors.data.detail)
          ? errors.data.detail.join('\n') // Affichage multi-ligne
          : errors.data.detail || "Echec de modification", color: 'error', progress: false, class: 'bg-error whitespace-pre-line !text-white'
      })
  }



}



</script>

