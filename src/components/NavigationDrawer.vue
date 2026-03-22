<script setup lang="ts">
import logo from "@/assets/logo.png"
</script>

<template>
	<VNavigationDrawer expand-on-hover rail color="var(--color-background)" :border="0" class="pt-3 position-fixed">
		<Vlist>
			<RouterLink :to="{ path: '/clients' }" class="link">
				<VListItem prepend-icon="mdi-apps">
					<VImg :src="logo" style="width: 80px" />
				</VListItem>
			</RouterLink>
		</Vlist>


		<VList density="compact" nav>
			<!-- <RouterLink :to="{ path: '/analytics' }" class="link">
				<VListItem prepend-icon="mdi-chart-bar" class="py-3" title="Аналитика (скоро)" value="analytics" />
			</RouterLink> -->
			<RouterLink :to="{ path: '/clients' }" class="link">
				<VListItem prepend-icon="mdi-account-card" class="py-3" title="Пользователи" value="clients" />
			</RouterLink>
			<RouterLink :to="{ path: '/notifications' }" class="link">
				<VListItem prepend-icon="mdi-message-badge-outline" class="py-3" title="Рассылки"
					value="notifications" />
			</RouterLink>
			<RouterLink to="/info" class="link">
				<VListItem prepend-icon="mdi-text-box-check-outline" class="py-3" title="Информация" value="info" />
			</RouterLink>
			<!-- <RouterLink to="/wb" class="link">
				<VListItem prepend-icon="mdi-list-status" class="py-3" title="W & B листы" value="W&B" />
			</RouterLink> -->
			<RouterLink to="/ads" class="link">
				<VListItem prepend-icon="mdi-sale-outline" class="py-3" title="Объявления" value="ads" />
			</RouterLink>
			<RouterLink to="/categories" class="link">
				<VListItem prepend-icon="mdi-view-grid-plus-outline" class="py-3" title="Категории объявлений"
					value="categories" />
			</RouterLink>
			<RouterLink to="/audio" class="link">
				<VListItem prepend-icon="mdi-book-music" class="py-3" title="Аудио-гид" value="audio" />
			</RouterLink>
			<RouterLink :to="{ path: '/promo' }" class="link">
				<VListItem prepend-icon="mdi-image-size-select-actual" class="py-3" title="Реклама" value="promo" />
			</RouterLink>
			<RouterLink :to="{ path: '/complaints' }" class="link">
				<VListItem prepend-icon="mdi-alert-circle-outline" class="py-3" title="Жалобы" value="complaint" />
			</RouterLink>
			<RouterLink :to="{ path: '/events' }" class="link">
				<VListItem prepend-icon="mdi-calendar-star" class="py-3" title="Мероприятия" value="events" />
			</RouterLink>
			<RouterLink :to="{ path: '/excursions' }" class="link">
				<VListItem prepend-icon="mdi-snowboard" class="py-3" title="Экскурсии" value="excursion" />
			</RouterLink>
			<RouterLink to="/excursion-categories" class="link">
				<VListItem prepend-icon="mdi-view-grid-plus-outline" class="py-3" title="Категории экскурсий"
					value="excursion-categories" />
			</RouterLink>
			<RouterLink :to="{ path: '/restaurants' }" class="link">
				<VListItem prepend-icon="mdi-store-marker-outline" class="py-3" title="Рестораны" value="restaurants" />
			</RouterLink>
			<RouterLink :to="{ path: '/transfers' }" class="link">
				<VListItem prepend-icon="mdi-plane-car" class="py-3" title="Трансферы" value="transfers" />
			</RouterLink>
			<RouterLink :to="{ path: '/snowmobile' }" class="link">
				<VListItem prepend-icon="mdi-snowmobile" class="py-3" title="Снегоходы" value="snowmobile" />
			</RouterLink>

			<VListItem prepend-icon="" />

			<a href="https://t.me/axas_store" class="link" target="_blank">
				<VListItem prepend-icon="mdi-headphones" title="Поддержка" class="py-3" value="support" />
			</a>
		</Vlist>
	</VNavigationDrawer>
</template>

<style scoped></style>
