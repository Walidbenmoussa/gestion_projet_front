<template>
  <UHeader :title="'Taches de :  ' + project.nom" :toggle="false">

    <template #right>
      <UButton icon="i-mingcute-add-fill" color="info" @click="Madd = true" />
    </template>
  </UHeader>

  <UMain class="p-4 w-full">
    <UTable ref="task_table" :data="tasks" :columns="cols"
      class="w-auto scroll-auto border-2 border-accented/30 mx-auto rounded-xl ">

      <template #nom-cell="{ row }">
        <UTooltip :text="row.original.descriptif">
          <h1>{{ row.original.nom }}</h1>
        </UTooltip>

      </template>


      <template #statut-cell="{ row }">
        <UBadge :label="row.original.statut" :color="couleur_statut(row.original.statut)" />
      </template>

      <template #responsable-cell="{ row }">
        <USelect :items="[...project?.team?.map((u) => (u.nom + ' ' + u.prenom)), 'Aucun']" :default-value="'Aucun'"
          :model-value="row.original?.user?.nom == undefined ? 'Aucun' :
            row.original?.user?.nom + ' ' + row.original?.user?.prenom" @update:model-value="val => {
              row_to_edit = row
              if (val === 'Aucun') {
                new_user = null;
              } else {
                new_user = project?.team?.find(u => (val == u.nom + ' ' + u.prenom))
              }
              Mchanger = true
            }
            " class="w-full"></USelect>
      </template>

      <template #action-cell="{ row }">
        <UDropdownMenu :items="items_action(row.original)">

          <UButton icon="i-lucide-more-vertical" color="secondary" class="w-fit" variant="ghost" />
        </UDropdownMenu>
      </template>



    </UTable>
  </UMain>

  <UConfirmation msg_annulation="Annuler" msg_confirmation="Confirmer la suppression"
    :msg_body="'Confirmer la suppression de : ' + task_delete?.nom" v-model:open="Mdelete"
    @confirmation="sumbit_delete" />


  <NewTask class="max-w-screen" :id_project="id_project" v-model="Madd" @close_success="closeNewTask" />
  <EditTask class="max-w-screen" :id_project="id_project" v-model:show-edit="Medit" v-model:edit-task="task_edit"
    @close_success="closeEditTask" />

  <UConfirmation msg_annulation="Annuler" msg_confirmation="Confirmer" :msg_body="msg_confirmation_changement"
    @confirmation="submit_user_change" v-model:open="Mchanger" />

  <Comments :task="task_comments" ref="Mcomments"></Comments>
</template>



<script lang="ts" setup>
import { dropdownMenu, user } from '#build/ui'
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import EditTask from '~/components/EditTask.vue'
import type { Project, Task, User } from '~/types'

const IP = useCookie('IP')
const toast = useToast()
const id_project = Number(useRoute().params.id)
const project = ref<Project>()
const tasks = ref<Task[]>([])

const Mdelete = ref(false)
const Madd = ref(false)
const Medit = ref(false)
const Mchanger = ref(false)
const Mcomments = useTemplateRef('Mcomments')

const user_task = ref([])
const task_delete = ref<Task>()
const task_edit = ref<Task>({
  date_debut: undefined,
  date_fin: undefined,
  descriptif: undefined,
  id: undefined,
  id_project: undefined,
  nom: undefined,
  priorite: undefined,
  statut: undefined
})

const task_comments = ref<Task>()

const row_to_edit = ref()
const new_user = ref<User>()

const cols: TableColumn<Project>[] = [
  {
    accessorKey: 'nom',
    header: 'Nom de la tache',

  },
  {
    accessorKey: 'date_debut',
    header: 'Date début',
    cell: (c) => {
      return new Date(c.getValue('date_debut')).toLocaleDateString()
    }
  },

  {
    accessorKey: 'date_fin',
    header: 'Date fin',
    cell: (c) => {
      return new Date(c.getValue('date_fin')).toLocaleDateString()
    }
  },

  {
    accessorKey: 'statut',
    header: 'Statut',

  },
  {
    accessorKey: 'priorite',
    header: 'priorité'
  },

  {
    accessorKey: 'responsable',
    header: 'Responsable'

  },
  {
    accessorKey: 'action',
    header: 'Action'
  }
]


try {
  const data_project = await $fetch(`${IP.value}/project/${id_project}`, {
    method: 'get',
    credentials: 'include',
  })
  project.value = { ...data_project }
  console.log(project.value?.team)

}
catch (errors) {
  console.log(errors)

}



const project_tasks = await useFetch(`${IP.value}/project_tasks/${id_project}`, {
  method: 'get',
  credentials: 'include',
})
tasks.value = structuredClone(project_tasks.data.value)

function items_action(t: Task): DropdownMenuItem[] {
  return [{
    label: 'Commenter',
    icon: '',
    onSelect:
      () => {
        Mcomments.value.open(t)


      }

  },
  {
    label: 'Modifier',
    icon: '',
    onSelect: () => {
      task_edit.value = { ...t }
      Medit.value = true
    }
  },
  {
    label: 'Supprimer',
    icon: '',
    onSelect: () => {
      task_delete.value = t
      Mdelete.value = true

    }
  }]

}

const closeNewTask = async () => {
  await project_tasks.execute()
  tasks.value = [...project_tasks.data.value]
}

const closeEditTask = async () => {

  const i = tasks.value.findIndex(p => (p.id == task_edit.value.id))
  console.log(tasks.value[i])
  tasks.value[i] = { ...task_edit.value }

}

const sumbit_delete = async () => {
  Mdelete.value = false
  try {
    const response = await $fetch(`${IP.value}/task/${task_delete.value.id}`, {
      method: 'delete',
      credentials: 'include'
    })

    toast.add({ description: response, color: 'primary', progress: false, class: 'bg-primary' })

    await project_tasks.execute()
    tasks.value = [...project_tasks.data.value]



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



const submit_user_change = async () => {

  if (new_user.value) {
    const response = await $fetch(`${IP.value}/task/user/${row_to_edit.value.original.id}/${new_user.value?.id}`, {
      method: 'patch',
      credentials: 'include'
    })
      row_to_edit.value.original.user = { ...new_user.value }

  }

  else {
    const response = await $fetch(`${IP.value}/task/user/${row_to_edit.value.original.id}/0`, {
      method: 'patch',
      credentials: 'include'
    })
    delete row_to_edit.value.original.user

  }





  Mchanger.value = false

}

const msg_confirmation_changement = computed(() => {
  if (new_user.value) {
    return `Nouveau responsable de ${row_to_edit.value?.original?.nom}: ${new_user.value?.nom} ${new_user.value?.prenom}`
  }
  else {
    return `Aucun nouveau responsable de ${row_to_edit.value?.original?.nom}`
  }
})



function couleur_statut(statut: string) {

  const couleur_st = { 'Planifié': 'info', 'En cours': 'success', 'Suspendu': 'warning', 'Abandonné': 'neutral', 'Terminé': 'neutral' }
  return couleur_st[statut]


}


</script>
