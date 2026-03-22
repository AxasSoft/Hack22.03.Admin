<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps({
	top: String
})

const emit = defineEmits(['load'])

const marker = ref<HTMLElement | null>(null);

onMounted(async () => {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					emit("load")
				}
			});
		},
		{
			threshold: 0.5,
		}
	);


	if (marker.value) {
		observer.observe(marker.value);
	}
});
</script>

<template>
	<div class="marker-wrapper">
		<div ref="marker" class="marker"></div>
	</div>
</template>

<style scoped>
.marker-wrapper {
	position: relative;
	max-width: 1px;
}

.marker {
	position: absolute;
	top: v-bind(top);
	left: 0;
	right: 0;
	display: inline-block;
	width: 100%;
	height: 1px;
	opacity: 0;
	z-index: -1;
}
</style>
