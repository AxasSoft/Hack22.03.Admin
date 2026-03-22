<template>
    <div class="pa-4" style="border-bottom: 1px solid #00000016;">
        <h2>{{ firstName + " " + lastName }}</h2>

    </div>
    <VContainer width="1200px" class="d-flex">
        <ProfileMenu :selected="'pass'" />


        <VCard class="v-col-8 pa-0">
            <div class="py-3" style="border-bottom: 1px solid #00000016;">
                <p class="mx-6 page-title">Изменение пароля</p>
            </div>
            <VForm class="pa-6 d-flex flex-column" @submit.prevent="changePass">
                <p class="field-name">Старый пароль</p>
                <VTextField variant="plain" v-model="oldPass" width="50%" :rules="passwordRules"
                    class="custom-tf mt-1 pa-0" :append-icon="oldPassShow ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="oldPassShow ? 'text' : 'password'" @click:append="oldPassShow = !oldPassShow" />

                <p class="field-name">Новый пароль</p>
                <VTextField variant="plain" v-model="newPass" width="50%" :rules="passwordRules"
                    class="custom-tf mt-1 pa-0" :append-icon="newPassShow ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="newPassShow ? 'text' : 'password'" @click:append="newPassShow = !newPassShow" />

                <p class="field-name">Повторите новый пароль</p>
                <VTextField variant="plain" v-model="repeatNewPass" width="50%" :rules="passwordRules"
                    class="custom-tf mt-1 pa-0" :append-icon="repeatNewPassShow ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="repeatNewPassShow ? 'text' : 'password'"
                    @click:append="repeatNewPassShow = !repeatNewPassShow" />

                <VBtn class="text-none mt-auto black-button" type="submit" elevation="0">
                    Сохранить
                </VBtn>
            </VForm>

        </VCard>

    </VContainer>
    <div>

    </div>
</template>

<script setup lang="ts" scoped>
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { useToast } from "vue-toastification";
import ProfileMenu from './ProfileMenu.vue';


const userStore = useUserStore()
const toast = useToast()
const firstName = ref(userStore.user.firstName ? userStore.user.firstName : "")
const lastName = ref(userStore.user.lastName ? userStore.user.lastName : "")

const oldPass = ref("")
const oldPassShow = ref(false)
const newPass = ref("")
const newPassShow = ref(false)
const repeatNewPass = ref("")
const repeatNewPassShow = ref(false)


const passwordRules = [
    (value: string) => !!value || "Обязательное поле",
    (value: string) => value.length >= 8 || "Минимум 8 символов"
];

async function changePass() {

    if (newPass.value.length < 8) {
        toast.error("Пароль слишком короткий")
        return
    }

    if (newPass.value != repeatNewPass.value) {
        toast.error("Пароли не совпадают")
        return
    }



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await userStore.changePass(oldPass.value, newPass.value)
    console.log(response)
    if (response.status == 200) {
        toast.success("Пароль успешно изменён");

        oldPass.value = ''
        newPass.value = ''
        repeatNewPass.value = ''
    } else {
        toast.error(response.response.data.description);
    }
}
</script>

<style lang="scss">
.main-container {
    background: var(--color-background-soft);
    height: 100vh;
    margin: 0;
    padding: 0;
}

.page-title {
    font-size: 20px;
    font-weight: 600;
}

.field-name {
    font-size: 14px;
    font-weight: 500;
}
</style>