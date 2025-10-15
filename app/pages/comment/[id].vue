<template>
  <UMain>

    <UCard class="w-3xs">
      <template #header>
        <h1>Discussion </h1>
      </template>
      <UChatPalette class=" max-h-72 " should-auto-scroll :should-scroll-to-bottom="true">
        <UChatMessages  >
          <UChatMessage  :ui="{ content: m.user.id == user.id ?  'bg-primary-50 p-2 rounded' :'bg-neutral-200 p-2 rounded' }"
          v-for="(m, index) in messages_data.data.value" :side="m.user.id == user.id ? 'right' : 'left'"
            variant="subtle" :key="index" :parts="[{ type: 'text'}]">
            <template #content >
              <p class="text-[0.75rem]">{{ m.txt }}</p>
              <h4 class="text-[0.5rem] italic">{{ new Date(m.date_comment).toLocaleString() }}</h4>
              <h4 class="text-primary-300 text-[0.5rem] text-xs italic">{{ m.user.nom }}</h4>

            </template>

          </UChatMessage>

        </UChatMessages>

        <template #prompt>
          <UTextarea v-model="send_msg" variant="outline" multi-line :highlight="false" :ui="{trailing:'flex flex-row items-end'}"  >           
          </UTextarea>
          <UButton label="Envoyé" block class="mt-2" @click="send"/>
                        


        </template>


      </UChatPalette>
    </UCard>

  </UMain>
</template>

<script lang="ts" setup>
const taks_id = useRoute().params.id
const IP = useCookie('IP')
const send_msg = ref()

const user = useCookie('user')


const messages_data = await useFetch(`${IP.value}/comments/${taks_id}`, {
  credentials: 'include'
})

console.log(messages_data.data.value)


const send = async () => {
  const response = await $fetch(`${IP.value}/comments`, {
    method: 'POST',
    body: { 'txt': send_msg.value, 'id_task': taks_id },
    credentials: 'include'
  })

  send_msg.value = ''
  messages_data.refresh()



}

</script>

<style></style>