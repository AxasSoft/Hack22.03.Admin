<template>
    <VCard class="v-col-3 mr-8" height="300px">
        <VImg class="avatar mt-4" :src="avatar" cover />
        <VFileInput v-model="addedFiles" class="d-none" ref="fileInput" variant="solo" :clearable="false" hide-details
            prepend-icon="null" flat accept="image/jpeg, image/png, image/jpg" />
        <VIcon icon="mdi-camera" class="add-photo" color="var(--text-color)"
            @click="($refs.fileInput as HTMLInputElement)?.click()" />

        <div>
            <VBtn class="menu-button" :class="{ active_menu_button: props?.selected == 'account' }" variant="text"
                :to="{ path: '/profile/account' }">
                <VIcon icon="mdi-account-circle-outline" size="22" class="mr-2" />Аккаунт
            </VBtn>
            <VBtn class="menu-button" :class="{ active_menu_button: props?.selected == 'pass' }" variant="text"
                :to="{ path: '/profile/sequrity' }">
                <VIcon icon="mdi-key-chain-variant" size="22" class="mr-2" />Изменение пароля
            </VBtn>
        </div>
    </VCard>
</template>

<script setup lang="ts" scoped>
import { useUserStore } from '@/stores/userStore';
import axas from '@/assets/logo.png'
import { ref, watch } from 'vue';
import { useToast } from "vue-toastification";
import { fromBlob } from 'image-resize-compress';


const userStore = useUserStore()
const toast = useToast()
const avatar = ref(userStore.user.avatar.url ? userStore.user.avatar.url : axas)
const props = defineProps({
    selected: String
})
const fileInput = ref<HTMLInputElement>();
const addedFiles = ref()
watch(
    () => addedFiles.value,
    async () => {
        if (addedFiles.value) {
            userStore.user.avatar.file = (await fromBlob(addedFiles.value, 50, 'auto', 'auto', 'jpeg'))
            userStore.user.avatar.url = userStore.user.avatar.file != undefined ? URL.createObjectURL(userStore.user.avatar.file) : '';
            userStore.user.avatar.isChanged = true;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await userStore.updateAvatar();
            if (response.status === 200) {
                avatar.value = userStore.user.avatar.url
            } else {
                toast.error(response.response.data.description);
            }
        }
    }
);

</script>

<style lang="scss">
.main-container {
    background: var(--color-background-soft);
    height: 100vh;
    margin: 0;
    padding: 0;
}

.avatar {
    align-self: center;
    width: 150px;
    height: 150px;
    margin: 0 auto;
    background-color: var(--back-color);
    border-radius: 50%;
}

.add-photo {
    left: 170px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    top: -40px;
    background-color: white;
}

.menu-button {
    text-transform: none;
    width: 100%;
    color: var(--gray-text);
    // height: 40px !important;
    display: flex;
    justify-content: left;
}

.active_menu_button {
    font-weight: 600;
    color: var(--main-color);
    background-color: var(--back-color);
}
</style>