<template>
    <div class="gallery">
        <!-- Миниатюры -->
        <div class="thumbnails">
            <img v-for="(image, index) in images" :key="index" :src="image.thumbnail" :alt="image.alt"
                @click="selectImage(index)" class="thumbnail" :class="{ active: selectedImage === index }" />
        </div>

        <!-- Превью выбранного изображения -->
        <div class="preview">
            <img v-if="selectedImage !== null" :src="images[selectedImage].full" :alt="images[selectedImage].alt"
                class="full-image" />
            <p v-else>Выберите изображение для просмотра</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Тип для изображения
interface Image {
    thumbnail: string;
    full: string;
    alt: string;
}

// Список изображений
const images = ref<Image[]>([
    {
        thumbnail: 'https://via.placeholder.com/150',
        full: 'https://via.placeholder.com/600',
        alt: 'Image 1',
    },
    {
        thumbnail: 'https://via.placeholder.com/150/ff0000',
        full: 'https://via.placeholder.com/600/ff0000',
        alt: 'Image 2',
    },
    {
        thumbnail: 'https://via.placeholder.com/150/00ff00',
        full: 'https://via.placeholder.com/600/00ff00',
        alt: 'Image 3',
    },
]);

// Выбранное изображение
const selectedImage = ref<number | null>(null);

// Функция для выбора изображения
const selectImage = (index: number) => {
    selectedImage.value = index;
};
</script>

<style scoped>
.gallery {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.thumbnails {
    display: flex;
    gap: 10px;
}

.thumbnail {
    width: 100px;
    height: 100px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
}

.thumbnail.active {
    border-color: #42b983;
}

.full-image {
    max-width: 100%;
    max-height: 400px;
    border: 2px solid #42b983;
    border-radius: 8px;
}

.preview {
    margin-top: 20px;
    text-align: center;
}
</style>