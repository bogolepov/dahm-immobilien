import type { Handler, HandlerResponse } from '@netlify/functions';
import { SUPABASE_PROPERTIES_TABLE } from '@scripts/consts';
import { readSupabase } from '@scripts/readSupabase';
import type { Property } from '@scripts/supabase_types';
import { createPropertyFormData } from '@scripts/utils';
import type { PropertiesOutput, PropertyFormData } from '@scripts/zod';

function response(resCode: number, resObject: Object): HandlerResponse {
	if (resCode >= 400) console.error(resCode + ': ' + resObject);
	return {
		body: JSON.stringify(resObject),
		statusCode: resCode,
	};
}

export const handler: Handler = async (event, context) => {
	if (!readSupabase) return response(500, 'Supabase Error');

	const { data, error } = await readSupabase.from(SUPABASE_PROPERTIES_TABLE).select('*').eq('show', 'true');

	if (error) return response(500, error);

	const properties: Property[] = data ?? [];

	console.log(data);

	const property = createPropertyFormData();
	const objectsSale: PropertyFormData[] = [
		{
			...property,
			marketing_title: 'Mehrfamilienhaus in Hagen Boele',
			property_sid: 'Objekt Nr. 006',
			action_type: 'sale',
			address: { zip: '58099', city: 'Hagen', url_location: 'https://maps.app.goo.gl/r9enaKKN2Ao5AvDu9' },
			finance: { purchase_price: '350.000,00 €' },
			tech_details: { year_built: '1906' },
			url_image: 'https://awqevzpginfjkafpxzsa.supabase.co/storage/v1/object/public/property-images/verkauf6.jpg',
			show: true,
			status: 'available',
			slug: '',
		},
	];

	const objects: PropertiesOutput = { objectsSale, objectsRent: [] };

	return response(200, objects);
};
