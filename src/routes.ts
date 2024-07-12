// TODO
// 1. Add route group
// 2. Add route properties display on sidebar or not
/**
 * An array of public routes.
 * These routes are accessible to all users.
 *
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/informasi",
  "/reset-password",
  "/error",
];

/**
 * An array of routes that are use for authentication.
 *
 * @type {string[]}
 */
export const authRoutes: string[] = ["/signin", "/signup", "/signout"];

/**
 * The prefix for the API routes.
 * This is route will always open to the public because it is used for authentication.
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default route for the application after a user logs in.
 */
export const DEFAULT_ROUTE_AFTER_LOGIN = "/";

export interface Route {
  name: string;
  label: string;
  href: string;
  icon: string;
  order?: number;
  counter?: number;
  permissions?: string[];
  displayAsMenu?: boolean;
  cascadePermissions?: boolean; // cascade permissions to sub routes
}

const routes: Route[] = [
  {
    name: "api-files",
    label: "API files",
    href: "/api/files",
    icon: "Code",
    order: 100,
    permissions: ["read:api-files"],
    displayAsMenu: false,
  },
  {
    name: "api-upload",
    label: "API upload",
    href: "/api/upload",
    icon: "Code",
    order: 100,
    permissions: ["write:simbra"],
    displayAsMenu: false,
    cascadePermissions: true,
  },
  {
    name: "api-pendispo",
    label: "API upload",
    href: "/api/edispo",
    icon: "Code",
    order: 100,
    permissions: ["write:simbra"],
    displayAsMenu: false,
    cascadePermissions: true,
  },
  {
    name: "inputInbox",
    label: "Catat Masuk",
    href: "/mailbox/inbox/input",
    icon: "Pencil",
    order: 5,
    permissions: ["write:inbox"],
    displayAsMenu: true,
  },
  {
    name: "inbox",
    label: "Inbox",
    href: "/mailbox/inbox",
    icon: "Inbox",
    order: 10,
    permissions: ["read:inbox"],
    displayAsMenu: true,
  },
  {
    name: "disposisi",
    label: "Disposisi",
    href: "/mailbox/disposisi",
    icon: "TfiCommentAlt",
    order: 15,
    permissions: ["read:disposisi"],
    displayAsMenu: true,
  },
  {
    name: "inputOutbox",
    label: "Catat Keluar",
    href: "/mailbox/outbox/input",
    icon: "BsEnvelopeArrowUp",
    order: 20,
    permissions: ["write:outbox"],
    displayAsMenu: true,
  },
  {
    name: "outbox",
    label: "Keluar",
    href: "/mailbox/outbox",
    icon: "Send",
    order: 20,
    permissions: ["read:outbox"],
    displayAsMenu: true,
  },
  {
    name: "penomoran",
    label: "Penomoran",
    href: "/penomoran",
    icon: "TbNumber",
    order: 25,
    permissions: ["read:penomoran", "write:penomoran"],
    displayAsMenu: true,
  },

  {
    name: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: "Layout",
    order: 0,
    displayAsMenu: false,
  },
  {
    name: "mailbox",
    label: "Mailbox",
    href: "/mailbox",
    icon: "Inbox",
    order: 20,
    permissions: ["read:inbox", "read:outbox", "read:disposisi"],
    displayAsMenu: false,
  },

  {
    name: "eximcux",
    label: "Exim cux",
    href: "/eximcux",
    icon: "MdOutlineCloudSync",
    order: 40,
    permissions: ["write:simbra"],
    displayAsMenu: true,
    cascadePermissions: true,
  },
  {
    name: "eximcux",
    label: "cux List",
    href: "/eximcux/inbox",
    icon: "List",
    order: 40,
    permissions: ["write:simbra"],
    displayAsMenu: true,
  },
  {
    name: "upload-pdf",
    label: "upload pdf",
    href: "/upload-files",
    icon: "FaMailBulk",
    order: 40,
    permissions: ["write:simbra"],
    displayAsMenu: true,
  },
  {
    name: "setting-user",
    label: "users",
    href: "/setting/user",
    icon: "Contact",
    order: 45,
    permissions: ["write:simbra"],
    displayAsMenu: true,
  },
  {
    name: "setting-general",
    label: "general",
    href: "/setting/general",
    icon: "Settings",
    order: 50,
    permissions: ["write:simbra"],
    displayAsMenu: true,
  },
];

export async function getAllowedRoutes(
  clearance: string[] = []
): Promise<Route[]> {
  // Ensure clearance is an array
  if (!Array.isArray(clearance)) {
    console.error("Invalid clearance:", clearance);
    clearance = [];
  }

  const filteredRoutes = routes.filter((route) => {
    if (!route.permissions) {
      return true; // No permissions required, allow access
    }

    // Ensure route.permissions is an array before using it
    if (!Array.isArray(route.permissions)) {
      console.error("Invalid route permissions:", route.permissions);
      return false; // Skip routes with invalid permissions
    }

    return route.permissions.some((permission) =>
      clearance.includes(permission)
    );
  });

  const sortedRoutes = filteredRoutes.sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return sortedRoutes;
}

// check routes
