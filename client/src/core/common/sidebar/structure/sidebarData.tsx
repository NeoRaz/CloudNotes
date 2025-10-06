import { all_routes } from "../../../../feature-module/router/all_routes";
const routes = all_routes;

export const userSidebarData = [
  {
    label: "Notes",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Main",
    submenuItems: [
      {
        label: "List",
        link: routes.noteList,
        icon: "ti ti-layout-dashboard",
        showSubRoute: false,
        submenu: false,
      },
       {
        label: "Take Note",
        link: routes.takeNotes,
        icon: "ti ti-clipboard",
        showSubRoute: false,
        submenu: false,
      },
    ],
  },
  // {
  //   label: "AI",
  //   submenuOpen: true,
  //   submenuHdr: "Sales",
  //   submenu: false,
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Assistant",
  //       link: routes.assistant,
  //       icon: "ti ti-wand",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //   ],
  // },
];