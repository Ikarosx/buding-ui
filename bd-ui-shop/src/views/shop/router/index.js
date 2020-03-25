import Layout from "@/layout";
export default [
  {
    path: "/good",
    component: Layout,
    redirect: "/good/list",
    children: [
      {
        path: "list",
        name: "goodList",
        component: () => import("@/views/shop"),
        meta: { title: "商品列表" }
      },
      {
        path: "add",
        name:"goodAdd",
        component: () => import("@/views/shop/components/Good")
      }
    ],
  },
];
