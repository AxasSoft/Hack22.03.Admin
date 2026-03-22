<template>
    <div class="login d-flex">


        <VContainer class="img-container">
            <VImg class="ma-4" :width="140" style="max-width: 140px; max-height: 48px;" aspect-ratio="16/9" cover
                :src="logo" />
        </VContainer>

        <VContainer class="container lg-3 d-flex align-end flex-column">
            <span class="pa-2 mt-auto"></span>
            <VForm class="mx-auto my-auto auth-card pa-0" validate-on="submit lazy" @submit.prevent="onSubmit">
                <VCard class="white pa-2 h2" flat>
                    <VCardText class="px-0">
                        <span class="text-h4 font-weight-semibold">Добро пожаловать</span>
                    </VCardText>
                    <VTextField v-model.trim="email" :rules="emailRules" variant="solo" :elevation="false"
                        hide-details="auto" label="E-mail" />
                    <VTextField v-model.trim="password" :rules="passRules" variant="solo" :elevation="false"
                        hide-details="auto" label="Пароль" class="mt-2" type="password" />
                    <VBtn class="text-none accent-btn btn waves-effect waves-light auth-submit mt-6" size="large"
                        type="submit">
                        Войти
                    </VBtn>
                </VCard>
            </VForm>
            <span class="pa-2 mx-auto mt-auto" style="color: var(--gray-text); font-size: 13px;">© 2017-2025 AXAS</span>
        </VContainer>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VBtn, VCardText, VForm, VImg } from "vuetify/lib/components/index.mjs";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import logo from '@/assets/axas.png';
import { checkEmail } from "@/plugins/emailValidation";
import { useToast } from "vue-toastification";

const userStore = useUserStore();
const toast = useToast();
const email = ref("");
const password = ref("");
const router = useRouter();

const emailRules = [
    (value: string) => !!value || "Обязательное поле.",
    (value: string) => checkEmail(value) || "Укажите корректный e-mail.",
];

const passRules = [
    (value: string) => !!value || "Обязательное поле.",
    (value: string) => value.length < 8 || "Пароль слишком короткий",
];

async function onSubmit() {
    if (!checkEmail(email.value)) {
        return;
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await userStore.signIn(
        email.value, password.value
    );
    if (response.status === 200) {
        if (userStore.user.firstName === null) {
            router.push({ name: "profile_account" });
        } else {
            toast.success("Успешный вход в платформу");
            router.push({ name: "profile_account" });
        }
    } else {
        toast.error(response.response.data.description);
    }
}

</script>

<style>
@import '../../assets/index.css';

.img-container {
    height: 100vh;
    background-color: black;
    background: url('@/assets/images/login5.jpg') no-repeat center;
    background-size: cover;
    margin: 0;
}

.container {
    max-width: 500px;
    height: 100vh;
    align-content: center;
}

.login {
    width: 100%;
    background: var(--color-background);
    margin-bottom: 50px;
}

.auth-card {
    width: 400px
}

.auth-submit {
    width: 100%
}
</style>
