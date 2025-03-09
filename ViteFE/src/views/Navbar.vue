<template>
  <n-layout-sider
    collapse-mode="width"
    :collapsed-width="100"
    :collapsed="collapsed"
    :width="300"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <div
      style="
        text-align: center;
        padding: 20px;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
      "
    >
      {{ collapsed ? "W" : "WeaviateGUI" }}
    </div>
    <n-menu
      v-model:value="activeItem"
      :options="menuOptions"
      :collapsed="collapsed"
      :collapsed-width="100"
      :collapsed-icon-size="30"
      default-expand-all
    />
  </n-layout-sider>
</template>

<script setup lang="tsx">
import { MenuOption } from "naive-ui";
import { Icon } from "@iconify/vue";

const router = useRouter();
const route = useRoute();

const collapsed = ref<boolean>(false);
const activeItem = ref<string>(route.path);

watch(
  () => route.path,
  (newPath) => {
    activeItem.value = newPath;
  }
);

const menuOptions: MenuOption[] = [
  {
    label: () => (
      <router-link to={{ name: "Dashboard" }}>Dashboard</router-link>
    ),
    icon: () => (
      <n-icon>
        <Icon icon="material-symbols:dashboard" />
      </n-icon>
    ),
    key: router.resolve({ name: "Dashboard" }).href,
  },
  {
    label: () => (
      <router-link to={{ name: "Collections" }}>Collections</router-link>
    ),
    icon: () => (
      <n-icon>
        <Icon icon="unjs:db0" />
      </n-icon>
    ),
    key: router.resolve({ name: "Collections" }).href,
  },
  {
    label: () => (
      <router-link to={{ name: "Vector Search" }}>Vector Search</router-link>
    ),
    icon: () => (
      <n-icon>
        <Icon icon="noto-v1:magnifying-glass-tilted-left" />
      </n-icon>
    ),
    key: router.resolve({ name: "Vector Search" }).href,
  },
  {
    label: () => (
      <router-link to={{ name: "Migrations" }}>Migrations</router-link>
    ),
    icon: () => (
      <n-icon>
        <Icon icon="fluent-emoji:phoenix-bird" />
      </n-icon>
    ),
    key: router.resolve({ name: "Migrations" }).href,
  },
  {
    label: () => (
      <router-link to={{ name: "Visualize" }}>Visualize</router-link>
    ),
    icon: () => (
      <n-icon>
        <Icon icon="unjs:theme-colors" />
      </n-icon>
    ),
    key: router.resolve({ name: "Visualize" }).href,
  },
];
</script>

<style scoped></style>
