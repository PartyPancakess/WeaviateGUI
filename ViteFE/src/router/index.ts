import { createRouter, createWebHistory } from "vue-router";
import Layout from "@/layouts/Layout.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          name: "Dashboard",
          path: "",
          component: () => import("@/views/Dashboard/Dashboard.vue"),
        },
        {
          name: "Collections",
          path: "collection-list",
          component: () => import("@/views/CollectionList/CollectionList.vue"),
        },
        {
          name: "Collection",
          path: "collection/:collection",
          component: () => import("@/views/Collection/Collection.vue"),
        },
        {
          name: "Vector Search",
          path: "vector_search",
          component: () => import("@/views/VectorSearch/VectorSearch.vue"),
        },
        {
          name: "Migrations",
          path: "migrations",
          component: () => import("@/views/Migrations/Migrations.vue"),
        },
        {
          name: "Visualize",
          path: "visualize",
          component: () => import("@/views/Visualize/Visualize.vue"),
        },
      ],
    },
  ],
});

export default router;
