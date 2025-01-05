import type { RouteMeta as IRouteMeta } from '@vbird-core/typings';

import 'vue-router';

declare module 'vue-router' {
	interface RouteMeta extends IRouteMeta {}
}
