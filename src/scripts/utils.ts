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
