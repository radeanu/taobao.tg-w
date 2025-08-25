import type { App } from 'vue';

interface HTMLElementM extends HTMLElement {
    clickOutsideEvent: ($ev: MouseEvent) => void;
}

export default function (app: App) {
    app.directive('modal-teleport', {
        mounted(el: HTMLElementM) {
            document.body.appendChild(el);
        },
        beforeUnmount(el: HTMLElementM) {
            try {
                document.body.removeChild(el);
                // eslint-disable-next-line no-empty
            } catch {}
        }
    });
}
