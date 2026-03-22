<script setup lang="ts">
import logo from "@/assets/logo.png"
</script>

<template>
	<VNavigationDrawer expand-on-hover rail color="var(--color-background)" :border="0" class="pt-3 position-fixed">
		<Vlist>
			<RouterLink :to="{ path: '/orders' }" class="link">
				<VListItem prepend-icon="mdi-apps">
					<VImg :src="logo" style="width: 80px" />
				</VListItem>
			</RouterLink>
		</Vlist>

		<!-- <v-divider></v-divider> -->

		<VList density="compact" nav>
			<RouterLink :to="{ path: '/orders' }" class="link">
				<VListItem prepend-icon="mdi-view-dashboard" title="Главная" class="py-3" value="main" />
			</RouterLink>

			<VListGroup>
				<template v-slot:activator="{ props }">
					<div class="mt-2" v-bind="props">
						<VListItem prepend-icon="mdi-text-search-variant" title="Каталог" value="catalog" />
					</div>
				</template>
				<RouterLink to="/catalog/products" class="link">
					<VListItem prepend-icon="mdi-shopping-outline" class="py-3" title="Товары"
						value="catalog_products" />
				</RouterLink>
				<RouterLink to="/catalog/category" class="link">
					<VListItem prepend-icon="mdi-format-list-checks" class="py-3" title="Категории"
						value="catalog_categories">/>
				</RouterLink>
				<RouterLink :to="{ path: '/catalog/coupon' }" class="link">
					<VListItem prepend-icon="mdi-sale-outline" class="py-3" title="Промокоды" value="catalog_coupon" />
				</RouterLink>
			</VListGroup>

			<RouterLink :to="{ path: '/orders' }" class="link">
				<VListItem prepend-icon="mdi-text-box-check-outline" class="py-3" title="Заказы" value="orders" />
			</RouterLink>
			<RouterLink :to="{ path: '/clients' }" class="link">
				<VListItem prepend-icon="mdi-account-card" class="py-3" title="Клиенты" value="crm" />
			</RouterLink>
			<RouterLink :to="{ path: '/crm' }" class="link">
				<VListItem prepend-icon="mdi-trello" class="py-3" title="CRM" value="crm" />
			</RouterLink>
			<RouterLink :to="{ path: '/banners' }" class="link">
				<VListItem prepend-icon="mdi-image-size-select-actual" class="py-3" title="Баннеры" value="banners" />
			</RouterLink>

			<VListGroup>
				<template v-slot:activator="{ props }">
					<div class="mt-2" v-bind="props">
						<VListItem prepend-icon="mdi-cellphone" title="Приложение" />
					</div>
				</template>
				<RouterLink :to="{ path: '/style' }" class="link">
					<VListItem prepend-icon="mdi-palette" class="py-3" title="Стиль" value="style" />
				</RouterLink>
				<RouterLink :to="{ path: '/settings' }" class="link">
					<VListItem prepend-icon="mdi-chart-donut-variant" class="py-3" title="Настройки" value="settings" />
				</RouterLink>
			</VListGroup>


			<RouterLink :to="{ path: '/analytics' }" class="link">
				<VListItem prepend-icon="mdi-chart-bar" class="py-3" title="Аналитика" value="analytics" />
			</RouterLink>
			<RouterLink :to="{ path: '/orders' }" class="link">
				<VListItem prepend-icon="mdi-city" class="py-3" title="Города" value="city" />
			</RouterLink>
			<RouterLink :to="{ path: '/orders' }" class="link">
				<VListItem prepend-icon="mdi-store" class="py-3" title="Филиалы" value="shops" />
			</RouterLink>
			<VListItem prepend-icon="" />


			<RouterLink :to="{ path: '/myApps' }" class="link">
				<VListItem prepend-icon="mdi-cellphone" class="py-3" title="Мои магазины" value="myApps" />
			</RouterLink>
			<a href="https://t.me/axas_store" class="link" target="_blank">
				<VListItem prepend-icon="mdi-headphones" title="Поддержка" class="py-3" value="support" />
			</a>
		</Vlist>
		<!-- <template v-slot:append v-if="">
			<div class="pa-2">
				<p>copyright AXAS 2024</p>
			</div>
		</template> -->
	</VNavigationDrawer>
</template>

<style scoped></style>
