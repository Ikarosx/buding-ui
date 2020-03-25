import Layout from "@/layout";
export default [
  {
    path: "/user",
    component: Layout,
    redirect: "/user/center",
    children: [
      {
        path: "center",
        component: () => import("@/views/user/components/Center")
      },
      {
        path: "collection",
        component: () => import("@/views/user/collection")
      },
      {
        path: "publish",
        component: () => import("@/views/user/publish")
      },
      {
          path: "dialog",
          component: () => import("@/views/user/components/Dialog")
      }
    ]
  }
];
