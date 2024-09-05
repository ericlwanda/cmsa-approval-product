import { ISideMenuGroup } from "@/app/(FRONTEND)/admin/components/SideMenuGroups";



/**
 * Array of routes that dont require authentication
 */
export const publicRoutes = ["/"];

/**
 * Routes used for authentication
 */
export const authRoutes = ["/Login", "/Register"];

/**
 * Prefix for api authentication route
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect route after authentication
 */

export const DEFAULT_LOGIN_REDIRECT = "/admin";

/**
 * Routes for navigation bar
 */

export const SideBarMenuList: ISideMenuGroup[] = [


  {
    title: "Home",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: "home",
        permitted: ["ADMIN","USER","CEO","SLO","SPO","DRPP","MDD","SFA","REGISTRY"],
      },
    ],
    
  },

  {
    title: "Licensing",
    items: [
      // {
      //   label: "Application Forms",
      //   href: "/admin/forms",
      //   icon: "book",
      //   permitted: ["ADMIN","USER"],
      // },
      {
        label: "Applications",
        href: "/admin/applications",
        icon: "post",
        permitted: ["ADMIN","USER","CEO","FO","SLO","SFA","SPO","DRPP","MDD","REGISTRY"],
      },
      {
        label: "Approval letters",
        href: "/admin/license",
        icon: "page",
        permitted: ["USER"],
      },
    ],
  },



  {
    title: "Reports and Statistics",
    items: [
      {
        label: "Licensing reports",
        href: "/admin/license-types",
        icon: "page",
        permitted: ["ADMIN","CEO"],
      },
      {
        label: "Payments report",
        href: "/admin/payments",
        icon: "money",
        permitted: ["ADMIN",'FO','USER',"CEO"],
      },
      {
        label: "Reports",
        href: "/admin/reports",
        icon: "note",
        permitted: ["ADMIN",'FO','USER',"CEO"],
      },
    ],
  },

  {
    title: "Settings",
    items: [
      {
        label: "Users",
        href: "/admin/users",
        icon: "users",
        permitted: ["ADMIN"],
      },
      {
        label: "Product Types",
        href: "/admin/license-types",
        icon: "book",
        permitted: ["ADMIN"],
      },
    ],
  },
];
