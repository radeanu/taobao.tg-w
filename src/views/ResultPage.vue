<template>
    <main class="result-page">
        <div class="result-container">
            <div class="success-animation">
                <div class="checkmark-circle">
                    <div class="checkmark"></div>
                </div>
            </div>

            <div class="success-content">
                <h1 class="success-title">Заказ оформлен!</h1>
                <p class="success-description">
                    Ваш заказ успешно создан и отправлен в обработку. Мы свяжемся с вами в
                    ближайшее время.
                </p>
            </div>

            <div class="order-details">
                <div class="detail-item">
                    <div class="detail-icon">📋</div>
                    <div class="detail-text">
                        <span class="detail-label">Статус заказа</span>
                        <span class="detail-value">Принят в обработку</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-icon">⏰</div>
                    <div class="detail-text">
                        <span class="detail-label">Время обработки</span>
                        <span class="detail-value">1-2 рабочих дня</span>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <ShButton
                    kind="telegram"
                    full-width
                    class="primary-button"
                    @click="handleClose"
                >
                    Вернуться в магазин
                </ShButton>
            </div>

            <div class="footer">
                <p class="footer-text">Спасибо за ваш заказ! 🎉</p>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

import { ShButton } from '@UI';

const router = useRouter();

function handleClose() {
    router.push('/');
}
</script>

<style scoped lang="scss">
.result-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    padding-bottom: 100px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: var(--font-family);
}

.result-container {
    background: var(--tg-theme-bg-color, white);
    border-radius: 24px;
    padding: 40px 24px;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.success-animation {
    margin-bottom: 32px;
}

.checkmark-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    animation: scaleIn 0.6s ease-out 0.2s both;
    box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
}

@keyframes scaleIn {
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
}

.checkmark {
    width: 32px;
    height: 32px;
    border: 3px solid white;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
    animation: checkmarkDraw 0.6s ease-out 0.8s both;
}

@keyframes checkmarkDraw {
    from {
        opacity: 0;
        transform: rotate(45deg) scale(0);
    }
    to {
        opacity: 1;
        transform: rotate(45deg) scale(1);
    }
}

.success-content {
    margin-bottom: 32px;
}

.success-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--tg-theme-text-color, #1f2937);
    margin: 0 0 12px 0;
    animation: fadeIn 0.6s ease-out 0.4s both;
}

.success-description {
    font-size: 16px;
    line-height: 1.6;
    color: var(--tg-theme-hint-color, #6b7280);
    margin: 0;
    animation: fadeIn 0.6s ease-out 0.6s both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.order-details {
    margin-bottom: 32px;
    animation: fadeIn 0.6s ease-out 0.8s both;
}

.detail-item {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-bottom: 12px;
    background: var(--tg-theme-secondary-bg-color, #f9fafb);
    border-radius: 12px;
    border: 1px solid var(--tg-theme-hint-color, #e5e7eb);
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }

    &:last-child {
        margin-bottom: 0;
    }
}

.detail-icon {
    font-size: 24px;
    margin-right: 16px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--tg-theme-bg-color, white);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-text {
    flex: 1;
    text-align: left;
}

.detail-label {
    display: block;
    font-size: 12px;
    color: var(--tg-theme-hint-color, #6b7280);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
}

.detail-value {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: var(--tg-theme-text-color, #1f2937);
}

.action-buttons {
    margin-bottom: 24px;
    animation: fadeIn 0.6s ease-out 1s both;
}

.primary-button {
    margin-bottom: 12px;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
}

.secondary-button {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-2px);
    }
}

.footer {
    animation: fadeIn 0.6s ease-out 1.2s both;
}

.footer-text {
    font-size: 14px;
    color: var(--tg-theme-hint-color, #6b7280);
    margin: 0;
    font-weight: 500;
}

@media (max-width: 480px) {
    .result-container {
        padding: 32px 20px;
        margin: 10px;
    }

    .success-title {
        font-size: 24px;
    }

    .success-description {
        font-size: 15px;
    }

    .detail-item {
        padding: 12px;
    }

    .detail-icon {
        font-size: 20px;
        width: 36px;
        height: 36px;
    }
}
</style>
