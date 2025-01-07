import type { RouteMeta as IRouteMeta } from '@vbird-core/typings';

import 'vue-router';

declare module 'vue-router' {
	interface RouteMeta extends IRouteMeta {}
}

export interface VbirdAdminProAppConfigRaw {
	VITE_GLOB_API_URL: string;
}

export interface ApplicationConfig {
	apiURL: string;
}

declare global {
	interface Window {
		_VBIRD_ADMIN_PRO_APP_CONF_: VbirdAdminProAppConfigRaw;
	}
}
