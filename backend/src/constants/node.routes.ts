export const NODE_ROUTES = {
  BASE:      "/nodes",
  GET_ROOTS: "/roots",
  GET_BY_ID: "/:id",
  CREATE:    "/",
  DELETE:    "/:id",
  GET_CHILDREN: "/:id/children",
} as const;