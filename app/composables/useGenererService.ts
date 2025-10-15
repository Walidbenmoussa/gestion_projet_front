import dayjs, { Dayjs } from 'dayjs';

export default function (date_debut:Date ,date_fin:Date,debut_matin :Dayjs, fin_matin:Dayjs,
    debut_aprem:Dayjs ,fin_aprem :Dayjs,duree_plage:number
) {


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
  h_debut:string
  h_fin:string

} 


do {
  const plage_m = generate_plages_m(debut_matin, fin_matin, duree_plage)
  const plage_a = generate_plages_a(debut_aprem, fin_aprem, duree_plage)

  const jour = {
    'date_dispo': date_debut.toLocaleDateString(), 'plage_m': plage_m, 'plage_a': plage_a
  }
  dates.value.push(structuredClone(jour))
  date_debut.setDate(date_debut.getDate() + 1)
} while (date_debut <= date_fin)



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















}