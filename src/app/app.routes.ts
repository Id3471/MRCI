import { Routes } from '@angular/router';
import { Dashboard } from './Page/dashboard/dashboard';
import { Residence } from './Page/residence/residence';
import { Cartographie } from './Page/cartographie/cartographie';
import { CommoditePage } from './Page/commodite/commodite';
import { CommunePage } from './Page/commune/commune';
import { ProfilPage } from './Page/profil/profil';
import { QuartierPage } from './Page/quartier/quartier';
import { TypeAppartementPage } from './Page/type-appartement/type-appartement';
import { UserPage } from './Page/user/user';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'residences', component: Residence },
  { path: 'cartographie', component: Cartographie },
  { path: 'parametrage/commodites', component: CommoditePage },
  { path: 'parametrage/communes', component: CommunePage },
  { path: 'administration/profils', component: ProfilPage },
  { path: 'parametrage/quartiers', component: QuartierPage },
  { path: 'parametrage/types-appartement', component: TypeAppartementPage },
  { path: 'administration/utilisateurs', component: UserPage },
];
