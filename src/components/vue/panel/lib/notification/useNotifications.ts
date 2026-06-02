// src/composables/useNotifications.ts
import { useNotificationsStore } from './useNotificationStore';
import type { Notification, SoftModalNotification } from './notification';

export function useNotifications() {
	const store = useNotificationsStore();

	const toast = (message: string, options: Partial<Omit<Notification, 'id' | 'type'>> = {}) => {
		return store.add({ type: 'toast', message, ...options });
	};

	const persistentToast = (message: string, options: Partial<Omit<Notification, 'id' | 'type'>> = {}) => {
		return store.add({ type: 'persistent-toast', message, persistent: true, ...options });
	};

	const banner = (message: string, options: Partial<Omit<Notification, 'id' | 'type'>> = {}) => {
		return store.add({ type: 'banner', message, ...options });
	};

	const softModal = (payload: Omit<SoftModalNotification, 'id' | 'type'>) => {
		return store.add({ type: 'soft-modal', ...payload, persistent: true });
	};

	return {
		toast,
		persistentToast,
		banner,
		softModal,
		dismiss: store.remove,
		clearAll: store.clearAll,
	};
}
