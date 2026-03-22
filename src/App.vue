<template>
  <VApp>
    <VMain>
      <MainLayout v-if="layout == 'main-layout'">
        <router-view />
      </MainLayout>
      <EmptyLayout v-if="layout == 'empty-layout'">
        <router-view />
      </EmptyLayout>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const layout = computed(() => {
  return (route.meta.layout || "empty") + "-layout";
});
</script>

<style lang="scss">
// @import "materialize-css/dist/css/materialize.min.css";
@import "./assets/index.css";
</style>