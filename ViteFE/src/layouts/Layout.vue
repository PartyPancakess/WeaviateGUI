<template>
  <n-layout has-sider>
    <Navbar />
    <n-layout style="height: 100vh">
      <div class="px-20 py-10">
        <h1 style="fontSize: 25px">{{ $route.name }}</h1>
        <br />
        <br />
        <router-view />
      </div>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import { useThemeVars } from "naive-ui";
import Navbar from "@/views/Navbar.vue";

const themeVars = useThemeVars();
</script>

<style scoped></style>
