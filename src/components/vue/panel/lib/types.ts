import type { PropertyStatus } from '@scripts/supabase_types';

type PropStatus = Record<PropertyStatus, string>;
export const StatusList: PropStatus = {
	draft: 'Entwurf',
	available: 'Verfügbar',
	reserved: 'Reserviert',
	sold: 'Verkauft',
	rented: 'Vermietet',
};
