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
            <v-list-item @click="signOut" :active="false" prepend-icon="mdi-logout" title="Logout" value="logout" />
        </v-list>

        <v-divider></v-divider>

        <v-list>
            <v-list-item :active="false" prepend-icon="mdi-folder-plus" title="Add Section" value="add-section">
                <v-dialog transition="dialog-bottom-transition" v-model="modalVisible" activator="parent">
                    <AAddSectionForm v-model:visible="modalVisible" />
                </v-dialog>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact">
            <v-list-item v-for="section in sections.sections" :key="section.id" :prepend-icon="section.icon"
                :active="section.id === currentRoute.query?.section" @click="openSection(section as AntelopeSection)"
                :title="section.name" :value="section.id"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import AAddSectionForm from "@/components/AUpsertSectionForm.vue";
import { useAuth } from "@/composable/use_auth";
import { useSectionStore } from "@/store/section";
import { useRouter } from "vue-router"
import { AntelopeSection } from "@/model/AntelopeSection";

const sections = useSectionStore();
const { signOut } = useAuth();
const { push, currentRoute } = useRouter();

const modalVisible = ref<boolean>(false);

const openSection = (section: AntelopeSection) => {
    push({ path: '/dashboard', query: { section: section.id } });
} 
</script>

<style lang="scss">
.v-navigation-drawer__content::-webkit-scrollbar {
    display: none;
}
</style>