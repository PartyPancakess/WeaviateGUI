<template>
  <n-config-provider :theme-overrides="ThemeOverridesConst" :theme="darkTheme">
    <n-notification-provider>
      <n-modal-provider>
        <n-dialog-provider>
          <n-message-provider>
            <router-view />
          </n-message-provider>
        </n-dialog-provider>
      </n-modal-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ThemeOverridesConst } from '@/const/theme-overrides.const';
import { darkTheme } from 'naive-ui';
</script>
