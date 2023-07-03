import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'dev.cimma.lastplayed',
	appName: 'Last Played',
	webDir: 'build',
	server: {
		androidScheme: 'https'
	}
};

export default config;
