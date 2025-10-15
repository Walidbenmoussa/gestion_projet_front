<template>
    <UPage>
        <UForm @submit.prevent="submitProject" :state="edit_project" :validate="validate_form">
            <UCard class="mt-8">
                <template #header>
                    <div class="flex flex-col">
                        <UIcon class="size-10 self-center" color="primary" name="i-lucide-box" />
                        <h1 class="self-center">Modifier Projet</h1>
                    </div>
                </template>
                <UFormField label="Nom" name="nom">
                    <UInput v-model="edit_project.nom" type="text" class="w-full" />
                </UFormField>
                <UFormField label="Description" name="description">
                    <UTextarea v-model="edit_project.description" type="textarea" class="w-full" />
                </UFormField>

                <UFormField label="Date de début" name="date_debut" :eager-validation="true">
                    <PopCalendar v-model="edit_project.date_debut" />
                </UFormField>


                <UFormField label="Date de fin" name="date_fin" :eager-validation="true">

                    <PopCalendar v-model="edit_project.date_fin" />
                </UFormField>


                <UFormField label="Priorité">
                    <USelect v-model="edit_project.priorite" :items="['Faible', 'Importante', 'Urgente', 'Critique']"
                        class="w-full" />
                </UFormField>
                <UFormField label="Statut">
                    <USelect v-model="edit_project.statut"
                        :items="['Planifié', 'En cours', 'Suspendu', 'Abandonné', 'Terminé']" class="w-full" />
                </UFormField>
                <template #footer>
                    <UButton label="Enregitrer" block class="flex-1" type="submit" />
                    <UButton label="Réinitialiser" block class="flex-1" color="neutral" @click="resetProject" />
                    <UButton label="Retour" block class="flex-1" color="info" @click="$router.push('/dash_projects')" />

                </template>
            </UCard>

        </UForm>
    </UPage>
</template>



<script lang="ts" setup>

import { error } from '#build/ui'
import { CalendarDate, DateFormatter, getLocalTimeZone, resetLocalTimeZone, parseDate } from '@internationalized/date'
import { useGet } from '~/components/useGet'
import type { Project } from '~/types'

const IP = useCookie('IP')
const id_project = useRoute().params?.id
const toast = useToast()
const edit_project = ref<Project>()

const project = await useFetch(`${IP.value}/project/${id_project}`, {
    method: 'get',
    credentials: 'include',
})
delete project.data.value.team

edit_project.value = { ...project.data.value }



const validate_form = (p: Project) => {
    const errors = []

    if (!p.description) {
        errors.push({ 'name': 'description', 'message': 'remplir la description du projet' })
    }
    if (!p.nom) {
        errors.push({ 'name': 'nom', 'message': 'remplir le nom du projet' })
    }

    if (p.date_debut > p.date_fin) {
        errors.push({ 'name': 'date_debut', 'message': 'Date incohérante' }),
            errors.push({ 'name': 'date_fin', 'message': 'Date incohérante' })
    }
    return errors

}



const submitProject = async () => {

    try {
        const response = await $fetch(`${IP.value}/project`, {
            method: 'PATCH',
            credentials: 'include',
            body: edit_project.value,
            watche: false
        })
        toast.add({ description: response, color: 'primary', progress: false, class: 'bg-primary' })
        project.clear()
        await project.execute()
        delete project.data.value.team

        edit_project.value = { ...project.data.value }


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


const resetProject = async () => {

    edit_project.value = { ...project.data.value }
}


</script>

<style></style>