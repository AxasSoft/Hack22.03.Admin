<template>
    <VCard class="ma-5 container d-flex flex-column">
        <div class="header d-flex align-center justify-center v-align-center">
            <h2 class="ma-4">Аналитика</h2>

            <span class="ml-auto">
            </span>

        </div>


        <div class="hint">
            <VImg :src="hint" width="240px" height="240px" />
            <h2>Раздел находится в разработке</h2>
            <p>Новые функции скоро появятся!</p>
            <VBtn class="black-button mt-8" @click="openTG">За подробностями в TG</VBtn>
        </div>
    </VCard>
</template>

<script setup lang="ts">
import hint from '@/assets/images/DevHint.png'

const openTG = () => {
    window.open('https://t.me/axas_store', '_blank');
}
</script>

<style scoped>
.main-container {
    background: var(--color-background-soft);
    height: 100vh;
    margin: 0;
    padding: 0;
}

.container {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    max-width: calc(100% - 40px);
}

.header {
    border-bottom: 1px solid var(--border-color);
}

.create-app-link {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.627);
    margin: 5px 0;
}
</style>