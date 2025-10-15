<template>
  <UModal v-model:open="showEdit" class="w-xs" title="Modifier Tache">
    <template #body>

      <UForm @submit.prevent="submitTask" :state="editTask" :validate="validate_form">

        <UFormField label="Nom" name="nom">
          <UInput v-model="editTask.nom" type="text" class="w-full" />
        </UFormField>
        <UFormField label="Description" name="descriptif">
          <UTextarea v-model="editTask.descriptif" type="textarea" class="w-full" />
        </UFormField>

        <UFormField label="Date de début" name="date_debut" :eager-validation="true">
          <PopCalendar v-model="editTask.date_debut" />
        </UFormField>

        <UFormField label="Date de fin" name="date_fin" :eager-validation="true">
          <PopCalendar v-model="editTask.date_fin" />


        </UFormField>

        <UFormField label="Priorité">
          <USelect v-model="editTask.priorite" :items="['Faible', 'Importante', 'Urgente', 'Critique']"
            class="w-full" />
        </UFormField>
        <UFormField label="Statut">
          <USelect v-model="editTask.statut" :items="['Planifié', 'En cours', 'Suspendu', 'Abandonné', 'Terminé']"
            class="w-full" />
        </UFormField>
        <div class="flex flex-col gap-2 mt-4">
          <UButton label="Enregitrer" block class="flex-1" type="submit" />
          <UButton label="Réinitialiser" block class="flex-1" color="neutral" @click="reset" />
          <UButton label="Fermer" block class="flex-1" color="warning" @click="showEdit = false" />
        </div>

      </UForm>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Task } from '~/types'


const IP = useCookie('IP')
const toast = useToast()
const today = new Date()

const showEdit = defineModel('showEdit')
const editTask = defineModel<Task>('editTask')
const edit_fixe = ref()

const emits = defineEmits(['close_success'])

onMounted(() => {
  edit_fixe.value = { ...editTask.value }
  console.log(edit_fixe)
})

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

function reset() {
  editTask.value = { ...edit_fixe.value }

}

const submitTask = async () => {
  try {
    const response = await $fetch(`${IP.value}/task`, {
      method: 'patch',
      credentials: 'include',
      body: editTask.value,
      watch: false
    })
    toast.add({ description: response, color: 'primary', progress: false, class: 'bg-primary' })
    showEdit.value=false
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
