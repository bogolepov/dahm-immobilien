import type { Database } from './supabase_db_types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Property = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];

export type PropertyStatus = Database['public']['Enums']['object_status'];
export const PROPERTY_STATUSES = ['draft', 'available', 'reserved', 'sold', 'rented'] as const satisfies readonly PropertyStatus[];
export type ActionType = Database['public']['Enums']['action_type'];
export const ACTION_TYPES = ['sale', 'rent'] as const satisfies readonly ActionType[];
export type AuthRole = Database['public']['Enums']['auth_roles'];
export const AUTH_ROLES = ['super_admin', 'admin', 'manager'] as const satisfies readonly AuthRole[];

export type PropertyFormDataDB = Omit<Property, 'id' | 'created_at'> & {
	id: number | null;
};
