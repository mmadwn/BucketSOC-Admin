/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { EditBanner } from "views";
import { Dashboard, Icons, ListKategori, TambahKategori, ListBanner, EditKategori, TambahBanner} from "views";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/kategori",
    name: "Data Kategori",
    icon: "nc-icon nc-bullet-list-67",
    component: ListKategori,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/kategori/tambah",
    name: "Tambah Kategori",
    component: TambahKategori,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/kategori/edit/:id",
    name: "Edit Kategori",
    component: EditKategori,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/banner",
    name: "Data Banner",
    icon: "nc-icon nc-album-2",
    component: ListBanner,
    layout: "/admin",
    sidebar: true,
  },
  {
    path: "/banner/tambah",
    name: "Tambah Banner",
    component: TambahBanner,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/banner/edit/:id",
    name: "Edit Banner",
    component: EditBanner,
    layout: "/admin",
    sidebar: false,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-diamond",
    component: Icons,
    layout: "/admin",
    sidebar: true,
  },
];
export default routes;
