<template>
  <UPopover v-model:open="isOpen">
    <UButton :label="date_show" color="neutral" variant="subtle" icon="i-lucide-calendar" />

    <template #content>
      <UCalendar color="primary" v-model="date_format" class="p-2" @update:model-value="changer" />
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
import { CalendarDate } from '@internationalized/date'

const isOpen = ref(false)

const model = defineModel<Date>()

function changer() {
  isOpen.value = false
}


const date_format = computed({
  get: () => {
    try {

      const [y, m, d] = model.value.split('-').map(Number)
  
      return new CalendarDate(y, m, d)
    }
    catch {
      return null
    }
  },
  set: (newValue: CalendarDate) => {
    const ma_date = new Date(newValue.year, newValue.month - 1, newValue.day)
    model.value = ma_date.toLocaleDateString('fr-CA')
  }
})

const date_show = computed(() => {
  if(date_format.value=='Invalid Date' || date_format.value == null || date_format.value == undefined){
        return 'Sélectionner une date'
  }

  return new Date(date_format.value).toLocaleDateString()
 
}
)


</script>
