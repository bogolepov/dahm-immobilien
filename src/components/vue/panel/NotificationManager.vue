<!-- src/components/NotificationManager.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationsStore } from './lib/notification/useNotificationStore';
import type { Notification } from './lib/notification/notification';

const icons = {
	success: '✅',
	info: 'ℹ️',
	warning: '⚠️',
	error: '✖',
	neutral: '🔔',
};

const store = useNotificationsStore();

const groupedToasts = computed(() => {
	const map = new Map<string, Notification[]>();
	store.notifications
		.filter(n => n.type === 'toast' || n.type === 'persistent-toast')
		.forEach(notif => {
			const pos = notif.position ?? 'top-right';
			if (!map.has(pos)) map.set(pos, []);
			map.get(pos)!.push(notif);
		});
	return map;
});

const banners = computed(() => store.notifications.filter(n => n.type === 'banner'));
const softModals = computed(() => store.notifications.filter(n => n.type === 'soft-modal'));

const dismiss = (id: string) => store.remove(id);
</script>

<template>
	<div class="notification-manager">
		<!-- Toasts -->
		<div v-for="[position, toasts] in groupedToasts" :key="position" class="notification-toast-container" :data-position="position">
			<TransitionGroup name="toast">
				<div v-for="notif in toasts" :key="notif.id" class="notification-toast">
					<span class="notification-icon">{{ icons[notif.variant || 'neutral'] }}</span>

					<div class="notification-content">
						<div v-if="notif.title" class="notification-title">{{ notif.title }}</div>
						<p class="notification-message">{{ notif.message }}</p>

						<div v-if="notif.actions?.length" class="notification-actions">
							<button
								v-for="(action, idx) in notif.actions"
								:key="idx"
								@click="
									() => {
										action.handler();
										if (action.closeOnClick !== false) dismiss(notif.id);
									}
								"
								class="notification-action-btn"
								:class="{ primary: action.variant === 'primary' }"
							>
								{{ action.label }}
							</button>
						</div>
					</div>

					<button v-if="notif.dismissible !== false" @click="dismiss(notif.id)" class="notification-close">×</button>
				</div>
			</TransitionGroup>
		</div>

		<!-- Banners -->
		<div v-for="notif in banners" :key="notif.id">
			<Transition name="banner">
				<div class="notification-banner">
					<span class="notification-icon">{{ icons[notif.variant || 'neutral'] }}</span>
					<div class="notification-content">
						<strong v-if="notif.title">{{ notif.title }}</strong>
						{{ notif.message }}
					</div>
					<button v-if="notif.dismissible !== false" @click="dismiss(notif.id)" class="notification-close">×</button>
				</div>
			</Transition>
		</div>

		<!-- Soft Modals -->
		<div v-for="notif in softModals" :key="notif.id">
			<Transition name="modal">
				<div class="notification-modal-overlay">
					<div class="notification-modal">
						<div class="notification-modal-header">
							<div>
								<h2 v-if="notif.title" class="notification-modal-title">{{ notif.title }}</h2>
								<p class="notification-modal-message">{{ notif.message }}</p>
							</div>
							<button v-if="notif.dismissible !== false" @click="dismiss(notif.id)" class="notification-close">×</button>
						</div>

						<component v-if="notif.component" :is="notif.component" v-bind="notif.props || {}" />

						<div v-if="notif.actions?.length" class="notification-modal-actions">
							<button
								v-for="(action, idx) in notif.actions"
								:key="idx"
								@click="
									() => {
										action.handler();
										if (action.closeOnClick !== false) dismiss(notif.id);
									}
								"
								class="notification-action-btn"
								:class="{ primary: action.variant === 'primary' }"
							>
								{{ action.label }}
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style src="./NotificationManager.css"></style>
