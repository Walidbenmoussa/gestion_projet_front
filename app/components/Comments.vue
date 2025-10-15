<template>
  <UModal v-model:open="Mcomments" class="h-full">

    <template #header>
      <h1>{{ task.nom }} </h1>
      <h1>{{ task.id }}</h1>
    </template>

    <template #body>
      <UChatPalette class=" max-h-72 " should-auto-scroll :should-scroll-to-bottom="true">
        <UChatMessages>
          <UChatMessage v-if="Mcomments"
            :ui="{ content: m.user.id == user.id ? 'bg-primary-50 p-2 rounded' : 'bg-neutral-200 p-2 rounded' }"
            v-for="(m, index) in messages_data" :side="m.user.id == user.id ? 'right' : 'left'" variant="subtle"
            :key="index" :parts="[{ type: 'text' }]">
            <template #content>
              <p class="text-[0.75rem]">{{ m.txt }}</p>
              <h4 class="text-[0.5rem] italic">{{ new Date(m.date_comment).toLocaleString() }}</h4>
              <h4 class="text-primary-300 text-[0.5rem] text-xs italic">{{ m.user.nom }}</h4>

            </template>

          </UChatMessage>

        </UChatMessages>

        <template #prompt>
          <UTextarea v-model="send_msg" variant="outline" multi-line :highlight="false"
            :ui="{ trailing: 'flex flex-row items-end' }">
          </UTextarea>
          <UButton label="Envoyé" block class="mt-2" @click="send" />
        </template>


      </UChatPalette>
    </template>
  </UModal>

</template>

<script lang="ts" setup>
import type { Task } from '~/types'

const IP = useCookie('IP')
const send_msg = ref()
const user = useCookie('user')
const messages_data = ref(null)
const Mcomments = ref(false)
const task=ref<Task>()

const recuperer_data = async (id) => {
  return await $fetch(`${IP.value}/comments/${id}`,
    { credentials: 'include' }
  )
}


const open = async (t:Task) => {
  task.value={...t}
  messages_data.value = await recuperer_data(t.id)
  console.log(messages_data.value)

  Mcomments.value = true


  

}

function close() {
  Mcomments.value = false
}



const send = async () => {
  console.log(task.value)
  const response = await $fetch(`${IP.value}/comments`, {
    method: 'POST',
    body: { 'txt': send_msg.value, 'id_task': task.value.id },
    credentials: 'include'
  })
  send_msg.value = ''
  messages_data.value=await recuperer_data(task.value.id)




}

defineExpose({ open, close })
</script>

<style></style>