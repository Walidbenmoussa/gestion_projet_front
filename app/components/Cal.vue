<template>
  <UPageGrid>
    <UCard v-for="j in dates">
      <template #header>{{ j.date }}</template>
              <div class="h-12">Matin</div>

      
      <div>

        <div v-for="p in j.plage_m" class="flex flex-col">
          <div>
            {{p.h_debut}}
            <UCheckbox v-model="p.ouverte" />
          </div>
        </div>

        <div class="h-12">Aprés midi</div>

        <div v-for="p in j.plage_a" class="flex flex-col">
          <div>
          {{ p.h_debut }}
            <UCheckbox v-model="p.ouverte" />
          </div>
        </div>


      </div>
    </UCard>
  </UPageGrid>
  <h1>{{ dates }}</h1>



</template>

<script lang="ts" setup>
import dayjs, { Dayjs } from 'dayjs';


const dictionnaireMois = { 1: "Janvier", 2: "Février", 3: "Mars", 4: "Avril", 5: "Mai", 6: "Juin", 7: "Juillet", 8: "Août", 9: "Septembre", 10: "Octobre", 11: "Novembre", 12: "Décembre" };
const joursSemaine = { 0: "dim", 1: "lun", 2: "mar", 3: "mer", 4: "jeu", 5: "ven", 6: "sam" };


const date_debut = new Date(2025, 10, 1)
const date_fin = new Date(2025, 10,12 )

const dates = ref([])
const dates_7 = ref([])
let date = undefined

const debut_matin = dayjs().hour(8).minute(15)
const fin_matin = dayjs().hour(12).minute(0)

const debut_aprem = dayjs().hour(14).minute(0)
const fin_aprem = dayjs().hour(17).minute(40)

do {
  const plage_m = generate_plages_m(debut_matin, fin_matin, 15)
  const plage_a = generate_plages_a(debut_aprem, fin_aprem, 15)

  const jour = {
    'date_dispo': date_debut.toLocaleDateString(), 'plage_m': plage_m, 'plage_a': plage_a
  }
  console.log(jour)

  dates.value.push(structuredClone(jour))
  date_debut.setDate(date_debut.getDate() + 1)
} while (date_debut <= date_fin)


interface User {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  tel?: number;
}

interface Plage {
  ouverte: boolean
  reservee?: User

}

function generate_plages_m(debut_matin: Dayjs, fin_matin: Dayjs, duree_plage: number) {
  const nb_plage_matin = fin_matin.diff(debut_matin, 'minute') / (duree_plage) | 0
  let table: Plage[] = []
  /*let debut= structuredClone(debut_matin)*/
  let debut_m = debut_matin.clone();

  for (let i = 0; i < (nb_plage_matin); i++) {

    const p: Plage = {
      ouverte: true,
      reservee: null,
      h_debut: debut_m.format('HH:mm'),
      h_fin: debut_m.add(15, 'minute').format('HH:mm'),

    }
    debut_m = debut_m.add(15, 'minute')

    table.push(structuredClone(p))
  }
  return(table)

}



function generate_plages_a(debut_aprem: Dayjs, fin_aprem: Dayjs, duree_plage: number) {
  const nb_plage_aprem = fin_aprem.diff(debut_aprem, 'minute') / (duree_plage) | 0

  let table: Plage[] = []
  let debut_a = debut_aprem.clone()

  for (let i = 0; i < (nb_plage_aprem); i++) {


    const p: Plage = {
      ouverte: true,
      reservee: null,
      h_debut: debut_a.format('HH:mm'),
      h_fin: debut_a.add(15, 'minute').format('HH:mm'),

    }
    debut_a = debut_a.add(15, 'minute')

    table.push(structuredClone(p))
  }
  return (table)
}








//Diviser en tableau de 7 Jours
/*let semaine = Array(7).fill(null)
 
for (let i = 0; i < dates.value.length; i++) {
  const day = dates.value[i].getDay()
  if (day == 0) {
    semaine[6] = dates.value[i].toLocaleDateString()
 
    dates_7.value.push(structuredClone(semaine))
    semaine = Array(7).fill(null)
  } else {
    semaine[day - 1] = dates.value[i].toLocaleDateString()
  }
}
*/





</script>

<style></style>