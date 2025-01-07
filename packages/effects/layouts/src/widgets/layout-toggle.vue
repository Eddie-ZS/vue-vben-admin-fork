<script setup lang="ts">
import type { AuthPageLayoutType } from '@vbird/types';

import type { VbirdDropdownMenuItem } from '@vbird-core/shadcn-ui';

import { computed } from 'vue';

import { InspectionPanel, PanelLeft, PanelRight } from '@vbird/icons';
import { $t } from '@vbird/locales';
import { preferences, updatePreferences, usePreferences } from '@vbird/preferences';

import { VbirdDropdownRadioMenu, VbirdIconButton } from '@vbird-core/shadcn-ui';

defineOptions({
	name: 'AuthenticationLayoutToggle'
});

const menus = computed((): VbirdDropdownMenuItem[] => [
	{
		icon: PanelLeft,
		label: $t('authentication.layout.alignLeft'),
		value: 'panel-left'
	},
	{
		icon: InspectionPanel,
		label: $t('authentication.layout.center'),
		value: 'panel-center'
	},
	{
		icon: PanelRight,
		label: $t('authentication.layout.alignRight'),
		value: 'panel-right'
	}
]);

const { authPanelCenter, authPanelLeft, authPanelRight } = usePreferences();

function handleUpdate(value: string) {
	updatePreferences({
		app: {
			authPageLayout: value as AuthPageLayoutType
		}
	});
}
</script>

<template>
	<VbirdDropdownRadioMenu :menus="menus" :model-value="preferences.app.authPageLayout" @update:model-value="handleUpdate">
		<VbirdIconButton>
			<PanelRight v-if="authPanelRight" class="size-4" />
			<PanelLeft v-if="authPanelLeft" class="size-4" />
			<InspectionPanel v-if="authPanelCenter" class="size-4" />
		</VbirdIconButton>
	</VbirdDropdownRadioMenu>
</template>
