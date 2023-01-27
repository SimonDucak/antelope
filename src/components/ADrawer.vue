<template>
    <v-navigation-drawer expand-on-hover rail>
        <v-list>
            <v-list-item :active="false">
                <div class="d-flex align-center">
                    <v-avatar color="info mr-2">
                        <span class="text-body-2">SD</span>
                    </v-avatar>
                    <p class="text-body-2">s.ducak@gmail.com</p>
                </div>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
            <v-list-item :active="false" prepend-icon="mdi-logout" title="Logout" value="logout">
                <v-dialog transition="dialog-bottom-transition" v-model="modalVisible" activator="parent">
                    <AAddSectionForm v-model:visible="modalVisible" />
                </v-dialog>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
            <v-list-item @click="modalVisible = true" :active="false" prepend-icon="mdi-folder-plus" title="Add Section"
                value="add-section"></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact">
            <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
            <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
            <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>
    </v-navigation-drawer>

    <!-- Add section modal -->
    <AAddSectionModal v-modal:visible="modalVisible" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import AAddSectionForm from "@/components/AAddSectionForm.vue";

const modalVisible = ref<boolean>(false);
</script>


<style lang="scss">
.v-navigation-drawer__content::-webkit-scrollbar {
    display: none;
}
</style>