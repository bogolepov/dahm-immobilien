// src/stores/notifications.ts
import type { Notification } from './notification';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationsStore = defineStore('notifications', () => {
	const notifications = ref<Notification[]>([]);

	const add = (notification: Omit<Notification, 'id'>): string => {
		const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		const notif = { ...notification, id } as Notification;

		notifications.value.push(notif);

		// Авто-удаление для обычных toast
		if (!notif.persistent && notif.timeout !== 0) {
			const timeout = notif.timeout ?? 5000;
			setTimeout(() => {
				remove(id);
			}, timeout);
		}

		return id;
	};

	const remove = (id: string) => {
		notifications.value = notifications.value.filter(n => n.id !== id);
	};

	const clearAll = () => {
		notifications.value = [];
	};

	return {
		notifications,
		add,
		remove,
		clearAll,
	};
});
