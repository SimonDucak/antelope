<template>
    <div class="w-screen h-screen d-flex justify-center align-center">
        <div class="w-100 flex-column align-center d-flex" style="max-width: 420px">
            <img class="logo mb-4" src="/antelope_logo.svg" alt="Logo">
            <h3 class="text-h5 mb-10">Welcome to Antelope</h3>
            <v-btn @click="perform" :loading="isRunning" color="info">
                Login via Google
            </v-btn>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composable/use_auth";
import { useTask } from "@/composable/use_task";

const { signInViaGoogle } = useAuth();

const { isRunning, perform } = useTask(async () => {
    try {
        await signInViaGoogle();
    } catch (err) {
        alert(err);
    }
})
</script>

<style scoped>
.logo {
    width: 100px;
    height: auto;
}
</style>