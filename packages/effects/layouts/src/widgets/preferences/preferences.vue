<script lang="ts" setup>
import { computed } from 'vue';

import { Settings } from '@vbird/icons';
import { $t, loadLocaleMessages } from '@vbird/locales';
import { preferences, updatePreferences } from '@vbird/preferences';
import { capitalizeFirstLetter } from '@vbird/utils';

import { useVbirdDrawer } from '@vbird-core/popup-ui';
import { VbirdButton } from '@vbird-core/shadcn-ui';

import PreferencesDrawer from './preferences-drawer.vue';

const [Drawer, drawerApi] = useVbirdDrawer({
	connectedComponent: PreferencesDrawer
});

/**
 * preferences 转成 vue props
 * preferences.widget.fullscreen=>widgetFullscreen
 */
const attrs = computed(() => {
	const result: Record<string, any> = {};
	for (const [key, value] of Object.entries(preferences)) {
		for (const [subKey, subValue] of Object.entries(value)) {
			result[`${key}${capitalizeFirstLetter(subKey)}`] = subValue;
		}
	}
	return result;
});

/**
 * preferences 转成 vue listener
 * preferences.widget.fullscreen=>@update:widgetFullscreen
 */
const listen = computed(() => {
	const result: Record<string, any> = {};
	for (const [key, value] of Object.entries(preferences)) {
		if (typeof value === 'object') {
			for (const subKey of Object.keys(value)) {
				result[`update:${key}${capitalizeFirstLetter(subKey)}`] = (val: any) => {
					updatePreferences({ [key]: { [subKey]: val } });
					if (key === 'app' && subKey === 'locale') {
						loadLocaleMessages(val);
					}
				};
			}
		} else {
			result[key] = value;
		}
	}
	return result;
});
</script>
<template>
	<div>
		<Drawer v-bind="{ ...$attrs, ...attrs }" v-on="listen" />

		<div @click="() => drawerApi.open()">
			<slot>
				<VbirdButton
					:title="$t('preferences.title')"
					class="bg-primary flex-col-center size-10 cursor-pointer rounded-l-lg rounded-r-none border-none">
					<Settings class="size-5" />
				</VbirdButton>
			</slot>
		</div>
	</div>
</template>
