export function getDayName(shortName: string): string | undefined {
	switch (shortName.toLowerCase()) {
		case 'mo':
			return 'Montag';
		case 'di':
			return 'Dienstag';
		case 'mi':
			return 'Mittwoch';
		case 'do':
			return 'Donnerstag';
		case 'fr':
			return 'Freitag';
		case 'sa':
			return 'Samstag';
		case 'so':
			return 'Sonntag';
	}
	return undefined;
}

export function getDuration1991(): number {
	return new Date().getFullYear() - 1991;
}
export function getDuration2025(): number {
	return new Date().getFullYear() - 2025;
}
