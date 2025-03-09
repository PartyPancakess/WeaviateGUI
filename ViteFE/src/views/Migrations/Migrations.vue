<template>
  <n-card title="Clone" size="small" style="margin-bottom: 10px">
    <p style="padding-bottom: 10px; font-size: medium">
      Create a clone of an existing construct.
    </p>
    <CloneCollection />
    <CloneTenant />
  </n-card>
  <n-card title="Copy" size="small" style="margin-bottom: 10px">
    <p style="padding-bottom: 10px; font-size: medium">
      Copy the contents of an existing construct to another.
    </p>
    <CopyCollection />
    <CopyTenant />
  </n-card>
  <n-card title="Backup/Restore" size="small" style="margin-bottom: 10px">
    <Backup />
    <Restore />
  </n-card>
</template>

<script setup lang="tsx">
import Backup from "./components/Backup.vue";
import CloneCollection from "./components/CloneCollection.vue";
import CloneTenant from "./components/CloneTenant.vue";
import CopyCollection from "./components/CopyCollection.vue";
import CopyTenant from "./components/CopyTenant.vue";
import Restore from "./components/Restore.vue";
</script>

<style scoped></style>
