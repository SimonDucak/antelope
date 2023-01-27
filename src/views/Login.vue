<template>
    <div class="w-screen h-screen d-flex justify-center align-center">
        <div class="w-100" style="max-width: 300px">
            <v-btn @click="perform" :loading="isRunning" color="error" block>
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