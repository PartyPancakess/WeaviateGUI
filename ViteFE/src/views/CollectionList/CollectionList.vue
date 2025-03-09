<template>
  <n-input
    v-model:value="searchQuery"
    placeholder="Search collections"
    style="margin-bottom: 20px; width: 450px"
    clearable
  />

  <n-button
    strong
    secondary
    type="info"
    style="margin-left: 30px"
    @click="showAddCollectionModal = true"
  >
    Create Collection
  </n-button>

  <n-button style="margin-left: 30px" @click="isGridView = !isGridView">
    {{ isGridView ? "List View" : "Grid View" }}
  </n-button>

  <br />
  <br />

  <div v-if="isGridView">
    <n-button
      v-for="collection in filteredCollectionList"
      :key="collection"
      size="large"
      style="width: 210px; height: 210px; margin-right: 50px; padding: 0"
      @click="goToCollectionRoute(collection)"
    >
      <n-card style="width: 210px; height: 210px">
        <div
          style="
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            hyphens: auto;
            white-space: pre-wrap;
            text-align: center;
          "
          lang="en"
        >
          {{ collection }}
        </div>
        <div
          v-if="collection.length < 51"
          style="
            position: absolute;
            bottom: 10px;
            width: 100%;
            left: 0;
            text-align: center;
          "
        >
          <n-icon :size="themeVars.fontSize2">
            <Icon icon="unjs:db0" />
          </n-icon>
        </div>
      </n-card>
    </n-button>
  </div>
  <div v-else>
    <n-list>
      <n-list-item
        v-for="collection in filteredCollectionList"
        :key="collection"
      >
        <n-button
          style="width: 100%; display: flex; justify-content: flex-start; height: 50px"
          @click="goToCollectionRoute(collection)"
        >
          {{ collection }}
        </n-button>
      </n-list-item>
    </n-list>
  </div>

  <!-- Add New Collection Modal -->
  <n-modal
    v-model:show="showAddCollectionModal"
    style="max-height: 90vh; overflow-y: auto"
  >
    <n-card
      style="width: 600px"
      title="Create New Collection"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <p style="font-size: 16px">
        Adjust the below provided collection settings to customize your
        collection. For details:
        <a
          href="https://weaviate.io/developers/weaviate/api/rest#tag/schema/POST/schema"
          ><n-gradient-text type="info"> Weaviate Docs </n-gradient-text></a
        >
      </p>

      <n-divider />

      <n-space>
        <n-radio
          v-for="key in DefaultCollectionSettings.length"
          :key="key"
          :checked="checkedValueRef === key"
          :value="key"
          @change="handlePresetChange(key)"
        >
          {{ `Preset ${key}` }}
        </n-radio>
      </n-space>

      <n-divider />

      <n-form>
        <n-form-item label="Name" path="tenantName">
          <n-input
            v-model:value="collectionSettings"
            type="textarea"
            size="small"
            :autosize="{
              minRows: 15,
              maxRows: 20,
            }"
          />
        </n-form-item>

        <n-button
          tertiary
          round
          type="primary"
          style="
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
          "
          @click="createCollection"
        >
          <p style="text-align: center; margin: 0">Create</p>
        </n-button>
      </n-form>
    </n-card>
  </n-modal>
</template>

<script setup lang="tsx">
import { useCollectionListService } from "@/views/CollectionList/service/collection-list.service";
import { useThemeVars } from "naive-ui";
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { DefaultCollectionSettings } from "@/views/CollectionList/const/default-collection-settings.const";

const isGridView = ref<boolean>(true);

const collectionSettings = ref<string>(
  JSON.stringify(DefaultCollectionSettings[0], null, 2) as string
);

const collectionListService = useCollectionListService();

const collectionList = ref<string[]>([]);
const loading = ref<boolean>(false);

const showAddCollectionModal = ref<boolean>(false);
const checkedValueRef = ref<number>(1);

const router = useRouter();

const searchQuery = ref<string>("");

const themeVars = useThemeVars();

async function getData() {
  loading.value = true;
  try {
    const response = await collectionListService.getCollectionList();
    collectionList.value = response;
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

getData();

const filteredCollectionList = computed(() => {
  return collectionList.value
    .filter((collection) =>
      collection.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .sort((a, b) => a.localeCompare(b));
});

function goToCollectionRoute(collection: string) {
  router.push({ name: "Collection", params: { collection: collection } });
}

async function handlePresetChange(key: number) {
  checkedValueRef.value = key;
  collectionSettings.value = JSON.stringify(
    DefaultCollectionSettings[key - 1],
    null,
    2
  );
}

async function createCollection() {
  await collectionListService.createCollection(
    collectionSettings.value as string
  );
  const response = await collectionListService.getCollectionList();
  collectionList.value = response;

  showAddCollectionModal.value = false;
  collectionSettings.value = JSON.stringify(
    DefaultCollectionSettings[0],
    null,
    2
  );
  checkedValueRef.value = 1;
}
</script>

<style scoped></style>
