import { z } from 'zod';
import { PROPERTY_STATUSES, ACTION_TYPES, type PropertyFormDataDB } from './supabase_types';
import { Z_MARKETING_TITLE_MIN, Z_PROPERTY_SID_MIN } from './consts';

const zNullableString = z.preprocess(value => (value === '' ? null : value), z.string().nullable().default(null));
const zNullableNumber = z.preprocess(value => (value === '' ? null : value), z.number().nullable().default(null));
const zNullableObject = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) => schema.nullable().default(null);

const zNullableEmptyString = zNullableString.default('');
// ---------------- property -----------------
export const AddressKeys = ['street', 'building', 'city', 'zip', 'url_location'] as const;
export const zPropertyAddress = z.object({
	street: zNullableEmptyString,
	building: zNullableEmptyString,
	city: zNullableEmptyString,
	zip: zNullableEmptyString,
	url_location: zNullableEmptyString,

	hidden_fields: z.array(z.enum(AddressKeys)).default([]),
});

export const FinanceKeys = [
	'additional_costs',
	'purchase_price',
	'broker_commission',
	'notary_costs',
	'land_registry_costs',
	'property_transfer_tax',
	'monthly_rental_income',
	'annual_rental_income',
	'cold_rent',
	'warm_rent',
	'security_deposit',
	'price_per_sqm',
] as const;
export const zPropertyFinance = z.object({
	additional_costs: zNullableEmptyString,

	purchase_price: zNullableEmptyString,
	broker_commission: zNullableEmptyString,
	notary_costs: zNullableEmptyString,
	land_registry_costs: zNullableEmptyString,
	property_transfer_tax: zNullableEmptyString,
	monthly_rental_income: zNullableEmptyString,
	annual_rental_income: zNullableEmptyString,

	cold_rent: zNullableEmptyString,
	warm_rent: zNullableEmptyString,
	security_deposit: zNullableEmptyString,

	price_per_sqm: zNullableEmptyString,

	hidden_fields: z.array(z.enum(FinanceKeys)).default([]),
});

export const AreaKeys = [
	'plot_area',
	'building_footprint_area',
	'total_area',
	'usable_area',
	'living_area',
	'storage_production_area',
	'office_practice_area',
	'commercial_area',
	'site_coverage_ratio',
	'floor_area_ratio',
] as const;
export const zPropertyArea = z.object({
	plot_area: zNullableEmptyString,
	building_footprint_area: zNullableEmptyString,
	total_area: zNullableEmptyString,
	usable_area: zNullableEmptyString,
	living_area: zNullableEmptyString,
	storage_production_area: zNullableEmptyString,
	office_practice_area: zNullableEmptyString,
	commercial_area: zNullableEmptyString,

	site_coverage_ratio: zNullableEmptyString,
	floor_area_ratio: zNullableEmptyString,

	hidden_fields: z.array(z.enum(AreaKeys)).default([]),
});

export const SpaceKeys = [
	'ceiling_height',
	'number_of_floors',
	'residential_units',
	'rooms',
	'bedrooms',
	'bathrooms',
	'balcony',
	'terrace',
	'garden',
	'elevator',
	'basement',
	'garage',
	'parking',
] as const;
export const zPropertySpace = z.object({
	ceiling_height: zNullableEmptyString,
	number_of_floors: zNullableEmptyString,
	residential_units: zNullableEmptyString,

	rooms: zNullableEmptyString,
	bedrooms: zNullableEmptyString,
	bathrooms: zNullableEmptyString,

	balcony: zNullableEmptyString,
	terrace: zNullableEmptyString,
	garden: zNullableEmptyString,
	elevator: zNullableEmptyString,
	basement: zNullableEmptyString,
	garage: zNullableEmptyString,
	parking: zNullableEmptyString,

	hidden_fields: z.array(z.enum(SpaceKeys)).default([]),
});

export const TechDetailsKeys = [
	'year_built',
	'heating_type',
	'primary_energy_source',
	'energy_certificate_available',
	'energy_certificate_type',
	'energy_consumption',
	'energy_efficiency_class',
	'property_condition',
	'last_modernization_year',
	'last_renovation_year',
] as const;
export const zPropertyTechDetails = z.object({
	year_built: zNullableEmptyString,
	heating_type: zNullableEmptyString,
	primary_energy_source: zNullableEmptyString,
	energy_certificate_available: zNullableEmptyString,
	energy_certificate_type: zNullableEmptyString,
	energy_consumption: zNullableEmptyString,
	energy_efficiency_class: zNullableEmptyString,
	property_condition: zNullableEmptyString,
	last_modernization_year: zNullableEmptyString,
	last_renovation_year: zNullableEmptyString,

	hidden_fields: z.array(z.enum(TechDetailsKeys)).default([]),
});

export const zPropertyFormData = z.object({
	id: zNullableNumber,
	marketing_title: z.string().min(Z_MARKETING_TITLE_MIN).default(''),
	property_type: zNullableString,
	property_sid: z.string().min(Z_PROPERTY_SID_MIN).default(''),

	description: zNullableString,

	slug: z.string().default(''),
	url_image: zNullableString,
	url_expose: zNullableString,

	status: z.enum(PROPERTY_STATUSES).default('draft'),
	action_type: z.enum(ACTION_TYPES).default('sale'),
	show: z.boolean().default(true),

	address: zNullableObject(zPropertyAddress.partial()),
	finance: zNullableObject(zPropertyFinance.partial()),
	areas: zNullableObject(zPropertyArea.partial()),
	spaces: zNullableObject(zPropertySpace.partial()),
	tech_details: zNullableObject(zPropertyTechDetails.partial()),
});

export type PropertyFormData = z.infer<typeof zPropertyFormData>;

// check, that PropertyFormDataDB and PropertyFormData are equal
type AssertAssignable<T, U extends T> = true;
type _Check = AssertAssignable<PropertyFormDataDB, PropertyFormData>;

export type PropertyFormState = Omit<PropertyFormData, 'address' | 'finance' | 'areas' | 'spaces' | 'tech_details'> & {
	address: NonNullable<PropertyFormData['address']>;
	finance: NonNullable<PropertyFormData['finance']>;
	areas: NonNullable<PropertyFormData['areas']>;
	spaces: NonNullable<PropertyFormData['spaces']>;
	tech_details: NonNullable<PropertyFormData['tech_details']>;
};

export const zPropertiesOutput = z.object({
	objectsSale: z.array(zPropertyFormData),
	objectsRent: z.array(zPropertyFormData),
});
export type PropertiesOutput = z.infer<typeof zPropertiesOutput>;
export type Properties = z.infer<typeof zPropertiesOutput>;

export const zCompactPropertyFormData = zPropertyFormData.partial();
export const zPropertiesCache = z.object({
	timestamp: z.number(),
	objectsSale: z.array(zPropertyFormData.partial()),
	objectsRent: z.array(zPropertyFormData.partial()),
});
export type PropertiesCache = z.infer<typeof zPropertiesCache>;

// ----------------- login --------------------
export const zLoginInput = z.object({
	login: z.string().min(6),
	email: z.string().optional(),
	password: z.string().min(6),
});
export type LoginInput = z.infer<typeof zLoginInput>;

export const zUserInfo = z.object({
	role: z.enum(['admin', 'moderator', 'developer']),
});
export type UserInfo = z.infer<typeof zUserInfo>;
export type UserRole = z.infer<typeof zUserInfo>['role'];

// ------------- upload urls ----------------
export const zUploadUrlsInput = z.object({
	exposeFilename: z.string().optional(),
	imageFilename: z.string().optional(),
});
export type UploadUrlsInput = z.infer<typeof zUploadUrlsInput>;

export const zSignedUploadUrl = z.object({
	filename: z.string(),
	signedUrl: z.string(),
	path: z.string(),
});
export const zUploadUrlsOutput = z.object({
	expose: zSignedUploadUrl.optional(),
	image: zSignedUploadUrl.optional(),
});
export type SignedUploadUrl = z.infer<typeof zSignedUploadUrl>;
export type UploadUrlsOutput = z.infer<typeof zUploadUrlsOutput>;

// ------------- show properties ---------------
export const zUpdatePropertiesShowInput = z.array(
	z.object({
		id: z.number(),
		show: z.boolean(),
	}),
);
export type UpdatePropertiesShowInput = z.infer<typeof zUpdatePropertiesShowInput>;

// ------------- show properties ---------------
export const zDeletePropertyInput = z.object({
	id: z.number(),
});
export type DeletePropertyInput = z.infer<typeof zDeletePropertyInput>;

// --------- extractSchemaFromJson ------------
export function extractSchemaFromJson<T extends z.ZodTypeAny>(schema: T, json_data: string): z.infer<T> | undefined {
	try {
		const parsed = JSON.parse(json_data);
		const result = schema.safeParse(parsed);
		if (result.success) return result.data;

		console.log(result.error);
	} catch (error) {
		console.log(error);
		// JSON.parse ошибка или несовпадение схемы
	}
	return undefined;
}
