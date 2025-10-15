export interface User {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  psw?: string;
  date_inscription?: Date;
  poste?:string
}

export interface Project {
  id?: number;
  nom?: string;
  description: string;
  statut: string;
  priorite: string;
  date_debut: Date;
  date_fin: Date;
  team?:User[]
}

export interface Permis {
  permis: boolean;
  token: string;
  user: Omit<User, "psw">;
}

export interface Task {
  id?: number;
  nom?: string;
  descriptif?: string;
  statut?: string;
  priorite?: string;
  date_debut?: Date;
  date_fin?: Date;
  user_id?: number;
  id_project?: number;
  user?:User;
}

export interface Teams {
  creator: User;
  team: User[];
  reste: User[];
  project:Project;
}
