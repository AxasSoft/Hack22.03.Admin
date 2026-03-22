<script setup lang="ts">
import { useRouter } from "vue-router";
import NavigationDrawer from "@/components/NavigationDrawer.vue";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/stores/userStore";

const toast = useToast();
const router = useRouter();

const userStore = useUserStore();

const logout = async () => {
	const status = await userStore.logout();
	if (status === 200) {
		router.push({ name: "login" });
	} else {
		toast.error("Что-то пошло не так");
	}
};
</script>

<template>
	<VLayout full-height style="background: var(--color-background)">
		<NavigationDrawer />

		<VAppBar class="d-flex align-center position-fixed" :elevation="0" color="var(--color-background)">
			<p></p>
			<RouterLink class="d-flex align-center ml-auto  link " :to="{ path: '/profile/account' }">
				<VAvatar color="grey" size="48">
					<VImg v-if="userStore.user.avatar.url" :src="userStore.user.avatar.url" alt="Avatar" />
					<VIcon v-else icon="mdi-account-outline" size="36" />
				</VAvatar>
			</RouterLink>

			<VBtn class="ml-1" icon="mdi-logout" @click="logout" />
		</VAppBar>

		<VMain>
			<div class="wrapper">
				<RouterView />
			</div>
		</VMain>
	</VLayout>
</template>

<style scoped>
.main-container {
	background: var(--color-background-soft);
	height: 100vh;
	margin: 0;
	padding: 0;
}

.wrapper {
	background: var(--color-background-soft);
	border-radius: 10px;
	width: 100%;
	height: 100%;
	padding: 0.1px;
}
</style>