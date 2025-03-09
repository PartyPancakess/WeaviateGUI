<template>
  <n-row gutter="12">
    <n-col :span="6">
      <n-card title="Weaviate Version">
        {{ tableData.version }}
      </n-card>
    </n-col>
    <n-col :span="6">
      <n-card title="Weaviate Connection">
        {{ tableData.connection }}
      </n-card>
    </n-col>
    <n-col :span="6">
      <n-card title="Weaviate Is Live">
        <n-icon :size="themeVars.fontSize">
          <Icon
            v-if="tableData.isLive"
            icon="fluent-color:checkmark-circle-32"
          />
          <Icon v-else icon="fluent-color:dismiss-circle-32" />
        </n-icon>
      </n-card>
    </n-col>
    <n-col :span="6">
      <n-card title="Weaviate Is Ready">
        <n-icon :size="themeVars.fontSize">
          <Icon
            v-if="tableData.isReady"
            icon="fluent-color:checkmark-circle-32"
          />
          <Icon v-else icon="fluent-color:dismiss-circle-32" />
        </n-icon>
      </n-card>
    </n-col>
  </n-row>

  <br />
  <br />

  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="handleRouteChange('Collections')"
  >
    <n-card style="width: 200px; height: 200px" title="Collections">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="unjs:db0" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="handleRouteChange('Vector Search')"
  >
    <n-card style="width: 200px; height: 200px" title="Vector Search">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="noto-v1:magnifying-glass-tilted-left" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="handleRouteChange('Migrations')"
  >
    <n-card style="width: 200px; height: 200px" title="Migrations">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="fluent-emoji:phoenix-bird" />
        </n-icon>
      </div>
    </n-card>
  </n-button>

  <n-button
    size="large"
    style="width: 200px; height: 200px; margin-right: 50px; padding: 0"
    @click="handleRouteChange('Visualize')"
  >
    <n-card style="width: 200px; height: 200px" title="Visualize">
      <div>
        <n-icon :size="themeVars.fontSize2">
          <Icon icon="unjs:theme-colors" />
        </n-icon>
      </div>
    </n-card>
  </n-button>
</template>

<script setup lang="tsx">
import { useDashboardService } from "@/views/Dashboard/service/dashboard.service";
import { DBInfoDto } from "@/views/Dashboard/dto/db-info.dto";
import { useThemeVars } from "naive-ui";
import { Icon } from "@iconify/vue";

const dashboardService = useDashboardService();

const tableData = ref<DBInfoDto>({} as DBInfoDto);
const loading = ref<boolean>(false);

const router = useRouter();
const themeVars = useThemeVars();

async function getData() {
  loading.value = true;
  try {
    const response = await dashboardService.getDBInfo();
    tableData.value = response;
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

getData();

function handleRouteChange(route: string) {
  router.push({ name: route });
}
</script>

<style scoped></style>
