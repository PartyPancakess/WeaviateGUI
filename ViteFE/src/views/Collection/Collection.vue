<template>
  <n-card style="margin-bottom: 16px">
    <div style="display: flex; align-items: center">
      <span>{{ `Name: ${$route.params.collection}` }}</span>
      <n-button
        strong
        secondary
        type="error"
        style="margin-left: 30px"
        @click="showDeleteCollectionModal = true"
      >
        DELETE COLLECTION
      </n-button>
    </div>

    <br />

    <n-tabs type="line" animated v-model:value="tabValue">
      <n-tab-pane
        v-if="tenantActive"
        name="tenants"
        tab="Tenants"
        style="position: relative"
      >
        <!-- Conditionally render the two views -->
        <div v-if="!showVectors">
          <!-- Original Tenants List Content -->
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <n-input
                v-model:value="searchQuery"
                placeholder="Search tenants"
                style="width: 450px"
                clearable
              />
              <n-select
                v-model:value="statusFilter"
                :options="
                  ['ALL', 'ACTIVE', 'INACTIVE', 'OFFLOADED'].map((v) => ({
                    label: v,
                    value: v,
                  }))
                "
                placeholder="Filter by status"
                style="width: 150px; margin-left: 16px"
              />
              <n-button
                style="margin-left: 30px"
                @click="isGridView = !isGridView"
              >
                {{ isGridView ? "List View" : "Grid View" }}
              </n-button>
            </div>
            <n-button type="info" @click="showAddTenantModal = true">
              Add New Tenant
            </n-button>
          </div>

          <br />
          <br />

          <div v-if="isGridView">
            <n-button
              v-for="tenant in filteredTenants"
              :key="tenant.name"
              size="large"
              style="
                width: 200px;
                height: 200px;
                margin-right: 50px;
                margin-bottom: 20px;
                padding: 0;
              "
              @click="manageTenant(tenant)"
            >
              <n-card style="width: 200px; height: 200px">
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
                  {{ tenant.name }}
                </div>
                <div
                  style="
                    position: absolute;
                    bottom: 10px;
                    width: 100%;
                    left: 0;
                    text-align: center;
                  "
                >
                  <div v-if="tenant.name.length < 33">
                    <n-icon :size="themeVars.fontSize2">
                      <Icon icon="fluent:bot-16-regular" />
                    </n-icon>
                  </div>
                  <p
                    :style="{
                      fontSize: '80%',
                      color:
                        tenant.status === 'ACTIVE' || tenant.status === 'HOT'
                          ? 'green'
                          : 'grey',
                    }"
                  >
                    {{ tenant.status }}
                  </p>
                </div>
              </n-card>
            </n-button>
          </div>
          <div v-else>
            <n-list>
              <n-list-item v-for="tenant in filteredTenants" :key="tenant.name">
                <n-button
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    height: 50px;
                  "
                  @click="manageTenant(tenant)"
                >
                  <p
                    :style="`color: ${
                      tenant.status === 'ACTIVE' || tenant.status === 'HOT'
                        ? '#3D8D7A'
                        : '#D2665A'
                    }`"
                  >
                    {{ tenant.name }}
                  </p>
                </n-button>
              </n-list-item>
            </n-list>
          </div>
        </div>

        <!-- Vectors view with a Back button -->
        <div v-else>
          <n-button
            size="small"
            strong
            secondary
            type="warning"
            style="position: absolute; top: 10px; left: 0; z-index: 1"
            @click="showVectors = false"
          >
            < Go Back To Tenant List
          </n-button>
          <p
            style="
              position: absolute;
              top: 10px;
              left: 200px;
              z-index: 1;
              font-size: 16px;
              font-weight: 600;
              color: #2c3e50;
            "
          >
            Current Tenant:
            <span style="color: #3d8d7a">{{ activeTenant.name }}</span>
          </p>
          <div style="overflow: auto; margin-top: 40px">
            <n-space vertical>
              <Vectors
                :collectionName="(route.params.collection as string)"
                :tenantName="activeTenant.name"
              />
            </n-space>
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane v-else name="vectors" tab="Vectors">
        <div style="overflow: auto">
          <n-space vertical>
            <Vectors :collectionName="(route.params.collection as string)" />
          </n-space>
        </div>
      </n-tab-pane>

      <n-tab-pane name="collection-settings" tab="Collection Settings">
        <div style="overflow: auto">
          <n-space vertical>
            <div style="position: absolute; right: 0; top: 20px">
              <n-button @click="isEditing = true" v-if="!isEditing">
                Edit Settings
              </n-button>
            </div>

            <template v-if="!isEditing">
              <n-code
                :code="collectionSettings"
                language="javascript"
                :style="{ fontSize: '80%' }"
              />
            </template>
            <template v-else>
              <n-input
                v-model:value="editableSettings"
                type="textarea"
                :rows="30"
                :style="{ fontSize: '80%', fontFamily: 'monospace' }"
              />
              <n-space justify="end" style="margin-top: 16px">
                <n-button @click="isEditing = false">Cancel</n-button>
                <n-button type="primary" @click="saveSettings">Save</n-button>
              </n-space>
            </template>
          </n-space>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-card>

  <!-- Add New Tenant Modal -->
  <n-modal v-model:show="showAddTenantModal">
    <n-card
      style="width: 600px"
      title="Add New Tenant"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-form
        :rules="{
          tenantName: [{ required: true, message: 'Tenant name is required' }],
        }"
      >
        <n-form-item label="Name" path="tenantName">
          <n-input
            v-model:value="newTenant.name"
            placeholder="Tenant Name"
            required
          />
        </n-form-item>
        <n-form-item label="Status" path="tenantStatus">
          <n-select
            v-model:value="newTenant.status"
            :options="
              ['COLD', 'HOT', 'FROZEN'].map((v) => ({
                label: v,
                value: v,
              }))
            "
          >
          </n-select>
        </n-form-item>
        <n-form-item>
          <n-button
            type="primary"
            @click="handleAddTenantSubmit"
            :disabled="newTenant.name.length === 0"
          >
            Add Tenant
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </n-modal>

  <!-- Manage Tenant Modal -->
  <n-modal v-model:show="showManageTenantModal">
    <n-card
      style="width: 600px; text-align: center"
      title="Manage Tenant"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      {{ activeTenant?.name }}
      <n-divider />

      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <n-button type="info" @click="goToTenant"> Go To Tenant </n-button>

        <n-button
          v-if="
            activeTenant?.status === 'HOT' || activeTenant?.status === 'ACTIVE'
          "
          type="warning"
          @click="updateTenant(activeTenant.name, 'COLD')"
        >
          Deactivate Tenant
        </n-button>
        <n-button
          v-else
          type="success"
          @click="updateTenant(activeTenant.name, 'HOT')"
        >
          Activate Tenant
        </n-button>
      </div>

      <n-divider />

      <div style="display: flex; justify-content: center">
        <n-popconfirm @positive-click="deleteTenant(activeTenant.name)">
          <template #trigger>
            <n-button tertiary round type="error" style="width: 200px">
              DELETE TENANT
            </n-button>
          </template>
          Are you really going to remove this tenant like it meant nothing to
          you?
        </n-popconfirm>
      </div>
    </n-card>
  </n-modal>

  <!-- Delete Collection Modal -->
  <n-modal
    style="width: 600px"
    v-model:show="showDeleteCollectionModal"
    :mask-closable="false"
    size="huge"
    preset="dialog"
    title="Delete Collection"
    content="Are you sure?"
    positive-text="Confirm"
    negative-text="Cancel"
    @positive-click="deleteCollection"
  />
</template>

<script setup lang="tsx">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCollectionService } from "@/views/Collection/service/collection.service";
import { useThemeVars } from "naive-ui";
import { Icon } from "@iconify/vue";
import { TenantDto } from "./dto/tenant.dto";

const collectionService = useCollectionService();

const tabValue = ref<"tenants" | "vectors" | "collection-settings">("tenants");

const isGridView = ref<boolean>(true);

const showVectors = ref<boolean>(false);

const tenantList = ref<{ name: string; status: string }[]>([]);
const collectionSettings = ref<string>("");
const tenantActive = ref<boolean>(false);

const loading = ref<boolean>(false);

// Collection Settings Edit
const isEditing = ref<boolean>(false);
const editableSettings = ref<string>("");

// Modals
const showAddTenantModal = ref<boolean>(false);
const showManageTenantModal = ref<boolean>(false);
const showDeleteCollectionModal = ref<boolean>(false);

const activeTenant = ref<TenantDto>({ name: "temp", status: "" });

const searchQuery = ref<string>("");
const statusFilter = ref<any>();

const themeVars = useThemeVars();
const router = useRouter();
const route = useRoute();

async function getData(tab?: "tenants" | "vectors" | "collection-settings") {
  loading.value = true;
  try {
    const coll = await collectionService.getCollectionJSON(
      route.params.collection as string
    );

    if (coll?.multiTenancyConfig?.enabled) {
      tenantActive.value = true;
      const response = await collectionService.getCollectionTenants(
        route.params.collection as string
      );
      tenantList.value = response;
      tabValue.value = tab ?? "tenants";
    } else {
      tenantActive.value = false;
      tenantList.value = [];
      // When multi-tenancy is disabled, default to showing the Vectors tab
      tabValue.value = tab ?? "vectors";
    }

    collectionSettings.value = JSON.stringify(coll, null, 2);
    editableSettings.value = JSON.stringify(coll, null, 2);
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

getData();
const filteredTenants = computed(() => {
  return tenantList.value
    .filter((tenant) => {
      const matchesQuery = tenant.name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
      const matchesStatus =
        statusFilter.value === undefined ||
        statusFilter.value === "ALL" ||
        tenant.status === statusFilter.value;
      return matchesQuery && matchesStatus;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});

async function addTenant(
  tenantName: string,
  status: "COLD" | "HOT" | "FROZEN" = "COLD"
) {
  loading.value = true;
  try {
    await collectionService.addTenant(
      route.params.collection as string,
      tenantName,
      status
    );
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

async function deleteTenant(tenantName: string) {
  loading.value = true;
  try {
    await collectionService.remoteTenant(
      route.params.collection as string,
      tenantName
    );
    const response = await collectionService.getCollectionTenants(
      route.params.collection as string
    );
    tenantList.value = response;
  } catch (e: any) {
    console.log(e);
  } finally {
    showManageTenantModal.value = false;
    loading.value = false;
  }
}

async function updateTenant(
  tenantName: string,
  status: "COLD" | "HOT" | "FROZEN"
) {
  loading.value = true;
  try {
    await collectionService.updateTenant(
      route.params.collection as string,
      tenantName,
      status
    );

    const tenant = await collectionService.getTenant(
      route.params.collection as string,
      tenantName
    );
    activeTenant.value = tenant;

    const tenantIndex = tenantList.value.findIndex(
      (tenant) => tenant.name === tenantName
    );
    if (tenantIndex !== -1) {
      tenantList.value[tenantIndex].status = tenant.status;
    }
  } catch (e: any) {
    console.log(e);
  } finally {
    loading.value = false;
  }
}

const newTenant = ref<{ name: string; status: "COLD" | "HOT" | "FROZEN" }>({
  name: "",
  status: "COLD",
});

async function handleAddTenantSubmit() {
  await addTenant(newTenant.value.name, newTenant.value.status);

  // refresh tenant list
  const response = await collectionService.getCollectionTenants(
    route.params.collection as string
  );
  tenantList.value = response;

  showAddTenantModal.value = false;
  newTenant.value = { name: "", status: "COLD" };
}

async function manageTenant(tenant: { name: string; status: any }) {
  showManageTenantModal.value = true;
  activeTenant.value = tenant;
  showAddTenantModal.value = false;
}

function goToTenant() {
  showVectors.value = true;
  showManageTenantModal.value = false;
}

async function deleteCollection() {
  await collectionService.deleteCollection(route.params.collection as string);
  showDeleteCollectionModal.value = false;
  router.push({ name: "Collections" });
}

async function saveSettings() {
  try {
    await collectionService.updateCollection(
      route.params.collection as string,
      JSON.parse(editableSettings.value)
    );
    getData("collection-settings");
    isEditing.value = false;
  } catch (e: any) {
    console.log(e);
  }
}
</script>

<style scoped></style>
