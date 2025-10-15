<template>

  <UModal v-model:open="model" >
    <template #description>

      <h1>{{ props.msg_body }} </h1>

    </template>
    <template #footer ={close}>
      <UButton :label="props.msg_confirmation" color="primary" block @click="confirmer" />
      <UButton :label="props.msg_annulation" color="error" block @click="close" />
    </template>
  </UModal>

</template>

<script lang="ts" setup>

const props = defineProps<{
  msg_body: string,
  msg_confirmation: string
  msg_annulation: string
}>()

const emits=defineEmits(['confirmation'])


const model = defineModel()

function confirmer(){
  emits('confirmation')
}

</script>

<style></style>