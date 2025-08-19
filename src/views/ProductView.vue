<template>
    <div v-if="product" class="product">
        <h1>{{ product.article }}</h1>
        <p>Price: {{ product.priceRub }} RUB</p>
        <ShImage :image="product.image" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductPage } from '@/composables/useProductPage';
import ShImage from '@/components/UI/ShImage.vue';

const route = useRoute();
const { product, fetchProductById } = useProductPage();

onMounted(() => {
    const productId = route.params.id as string;
    if (productId) {
        fetchProductById(productId);
    }
});
</script>

<style lang="scss" scoped>
.product {
    padding: 20px;
}
</style>
