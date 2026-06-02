// src/types/notification.ts
import type { Component } from 'vue';

export type NotificationType = 'toast' | 'persistent-toast' | 'banner' | 'soft-modal';

export type NotificationVariant = 'success' | 'info' | 'warning' | 'error' | 'neutral';

export type NotificationPosition =
	| 'top-right'
	| 'top-left'
	| 'bottom-right'
	| 'bottom-left'
	| 'top-center'
	| 'bottom-center'
	| 'top'
	| 'bottom';

export interface NotificationAction {
	label: string;
	variant?: 'primary' | 'secondary' | 'text';
	handler: () => void | Promise<void>;
	closeOnClick?: boolean;
}

interface BaseNotification {
	id: string;
	type: NotificationType;
	variant?: NotificationVariant;
	message: string;
	title?: string;
	icon?: string | Component; // имя иконки или Vue-компонент
	timeout?: number; // 0 = никогда не исчезает
	persistent?: boolean;
	dismissible?: boolean; // по умолчанию true
	position?: NotificationPosition;
	data?: Record<string, any>; // любые дополнительные данные

	actions?: NotificationAction[]; // кнопки действий
}

// Конкретные типы (для лучшей типизации в менеджере)
export interface ToastNotification extends BaseNotification {
	type: 'toast' | 'persistent-toast';
}

export interface BannerNotification extends BaseNotification {
	type: 'banner';
	position?: 'top' | 'bottom';
}

export interface SoftModalNotification extends BaseNotification {
	type: 'soft-modal';
	component?: Component; // кастомный компонент внутри модалки
	props?: Record<string, any>;
}

export type Notification = ToastNotification | BannerNotification | SoftModalNotification;
