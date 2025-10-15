<template>
 
    <UCard class="w-full">
      <div class="flex flex-row w-full justify-between items-center bg-base-300  ">
        <UButton @click="down" icon="mingcute:arrow-left-line" />
          
        <p>{{ dictionnaireMois[mes_jours[index].mois] }} {{ mes_jours[index]?.anne }}</p>
        <UButton @click="up" icon="mingcute:arrow-right-line"  />
        
      </div>
      <div class="w-full overflow-x-auto pb-1.5">
  <div class="grid grid-flow-col auto-cols-[24rem] justify-start gap-3">
    <div v-for="j in mes_jours[index]?.data" 
         class="flex flex-col justify-center ">
           

      <UCard class="h-72">
        <template #header>
         <UButton 
         variant="soft"
        @click="change(j)" 
        :label="joursSemaine[new Date(j.date).getDay()] +' ' +j.nb " 
        
    
        :disabled="j.enable === false ? true:false" 
        :class=" j.enable === false ?  'opacity-50' : j.select === true ? 'primary' : 'opacity-20'"


        :color=" j.enable === false ?  'neutral' : j.select === true ? 'primary' : 'error'"
        />  
      </template>

      </UCard> 
    </div>
  </div>
</div>

      <div class="flex flex-col pb-2 px-1 gap-1.5  w-full">
        <UButton v-if="props.send_btn" color="primary" type="button" @click="send" block>Valider</UButton>
        <UButton color="neutral" type="button" @click="reset" block >Réinitialiser</UButton>
      </div>
   </UCard>:label="j.nb" 
  

  <h1>{{ mes_jours }}</h1>
</template>



<script setup lang="ts">



import { ref, defineExpose } from 'vue'
const dictionnaireMois = { 1: "Janvier", 2: "Février", 3: "Mars", 4: "Avril", 5: "Mai", 6: "Juin", 7: "Juillet", 8: "Août", 9: "Septembre", 10: "Octobre", 11: "Novembre", 12: "Décembre" };
const joursSemaine = {0: "dim",1: "lun",2: "mar",3: "mer",4: "jeu",5: "ven",6: "sam"};
const index = ref(0)
const mes_jours = ref([])// c'est le tableau des dates a affiché
const emits=defineEmits(['submit','reset'])

interface Props{
  send_btn?:boolean
}
const props=withDefaults(defineProps<Props>(),{send_btn:true})


const down = () => {
  if (index.value !== 0) {
    index.value--
  }
}

const today = new Date()
let mois_actuel = today.getMonth()
const mois_actuel_last = mois_actuel + 1
let annee_actuel = today.getFullYear()
const premierJour = new Date(annee_actuel, mois_actuel, 1).getDay()
const nb_jour = new Date(annee_actuel, mois_actuel_last, 0).getDate();
console.log(props.send_btn)

let data_premier_mois = []
for (let i = 1; i <= nb_jour; i++) {
  if (i < today.getDate())//jour debut 10
  {
    data_premier_mois.push({ 'nb': i, 'date': `${annee_actuel}/${mois_actuel_last}/${i}`, 'select': true, 'enable': false })
  } else {
    data_premier_mois.push({ 'nb': i, 'date': `${annee_actuel}/${mois_actuel_last}/${i}`, 'select': true, 'enable': true })
  }
}

mes_jours.value.push({ 'index_premier_j': premierJour, 'mois': mois_actuel_last, 'anne': annee_actuel, 'data': data_premier_mois })

const avance_mois = () => {
  mois_actuel = mois_actuel + 1;
  const mois_actuel_last = mois_actuel + 1
  const premierJour = new Date(annee_actuel, mois_actuel, 1).getDay()

  const nb_jour = new Date(annee_actuel, mois_actuel_last, 0).getDate();
  let data_new_mois = []
  for (let i = 1; i <= nb_jour; i++) {
    data_new_mois.push({ 'nb': i, 'date': `${annee_actuel}/${mois_actuel_last}/${i}`, 'select': true, 'enable': true })
  }
  mes_jours.value.push({ 'index_premier_j': premierJour, 'mois': mois_actuel_last, 'anne': annee_actuel, 'data': data_new_mois })
}

const up = () => {
  if (mes_jours.value[index.value]['mois'] === 12) {
    mois_actuel = -1
    annee_actuel = annee_actuel + 1
    avance_mois()
    index.value++
  } else {
    avance_mois()
    index.value++
  }
}

const change = (j) => {
  
  if (j.enable === true) {
    const index_click = mes_jours.value[index.value]['data'].findIndex(e => (e['date'] === j['date']))
    mes_jours.value[index.value]['data'][index_click]['select'] = !mes_jours.value[index.value]['data'][index_click]['select']
  }
}

const send = () => {
  let all_validate = []
  for (const i of mes_jours.value) {
    const validated = i['data'].filter(e => (e['select'] === true)).map(e => {
      all_validate.push(e.date)
    });
  }
  emits('submit',all_validate)
}


const get_dates = () => {
  let all_validate = []
  for (const i of mes_jours.value) {
    const validated = i['data'].filter(e => (e['select'] === true)).map(e => {
      all_validate.push(e.date)
    });
  }
  return all_validate;
}


const reset=()=>{
  emits('reset')
}




defineExpose({get_dates})


</script>
