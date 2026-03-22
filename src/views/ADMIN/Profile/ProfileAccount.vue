<template>
    <div class="pa-4" style="border-bottom: 1px solid #00000016;">
        <h2>{{ firstName + " " + lastName }}</h2>

    </div>
    <VContainer width="1200px" class="d-flex">
        <ProfileMenu :selected="'account'" />


        <VCard class="v-col-8 pa-0">
            <div class="py-3" style="border-bottom: 1px solid #00000016;">
                <p class="mx-6 page-title">Данные пользователя</p>
            </div>
            <VForm class="pa-6 d-flex flex-column" @submit.prevent="updateProfile">
                <p class="field-name">Логин (e-mail)</p>
                <VTextField variant="plain" v-model="userStore.user.email" :rules="emailRules"
                    class="custom-tf mt-1 pa-0" />

                <!-- <p class="field-name">Телефон</p>
                <VTextField variant="plain" width="50%" :rules="telRules" v-model="userStore.user.tel"
                    class="custom-tf mt-1 pa-0" v-mask="'+7 (###) ### ## ##'" /> -->

                <div class="d-flex">
                    <div class="flex-grow-1 mr-2">
                        <p class="field-name">Фамилия</p>
                        <VTextField variant="plain" v-model="userStore.user.lastName" :rules="nameRules"
                            class="custom-tf mt-1 pa-0" />
                    </div>
                    <div class="flex-grow-1 mx-2">
                        <p class="field-name">Имя</p>
                        <VTextField variant="plain" v-model="userStore.user.firstName" :rules="nameRules"
                            class="custom-tf mt-1 pa-0" />
                    </div>
                    <div class="flex-grow-1 ml-2">
                        <p class="field-name">Отчество</p>
                        <VTextField variant="plain" v-model="userStore.user.patronymic" class="custom-tf mt-1 pa-0" />
                    </div>


                </div>

                <p class="field-name">Дата рождения</p>
                <VTextField variant="plain" v-model="birthdate" @update:model-value="setNewbirthdate" type="date"
                    width="50%" class="custom-tf mt-1 pa-0" />

                <p class="field-name">Язык</p>
                <VSelect class="custom-tf" variant="plain" width="50%" v-model="languages[0]" :items="languages" item
                    item-value="0" />


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
import { checkEmail } from "@/plugins/emailValidation";
import { getStringDate, getUnixTime } from '@/plugins/unixTime';
import ProfileMenu from './ProfileMenu.vue';

const userStore = useUserStore()
const toast = useToast()
const firstName = ref(userStore.user.firstName ? userStore.user.firstName : "")
const lastName = ref(userStore.user.lastName ? userStore.user.lastName : "")

const languages = ["Русский (по умолчанию)"]

const emailRules = [
    (value: string) => !!value || "Обязательное поле.",
    (value: string) => checkEmail(value) || "Укажите корректный e-mail.",
];

const birthdate = ref(getStringDate(userStore.user.birthdate))

const setNewbirthdate = () => {
    userStore.user.birthdate = getUnixTime(birthdate.value)
}

const nameRules = [
    (value: string) => !!value || "Обязательное поле."
];


async function updateProfile() {
    if (!checkEmail(userStore.user.email)) {
        return;
    }

    // if (userStore.user.tel?.length != 18) {
    //     toast.error("Укажите корректный номер телефона")
    //     return;
    // } else {
    //     userStore.user.tel = userStore.user.tel.split(' ').join('').replace("+", "").replace("(", "").replace(")", "")
    // }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await userStore.updateProfile();
    if (response.status === 200) {
        toast.success("Данные успешно обновлены");
        firstName.value = userStore.user.firstName ? userStore.user.firstName : ""
        lastName.value = userStore.user.lastName ? userStore.user.lastName : ""
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