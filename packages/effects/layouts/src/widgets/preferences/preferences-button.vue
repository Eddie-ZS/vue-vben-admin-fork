<script lang="ts" setup>
import { Settings } from '@vbird/icons';

import { VbirdIconButton } from '@vbird-core/shadcn-ui';

import Preferences from './preferences.vue';

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

function clearPreferencesAndLogout() {
	emit('clearPreferencesAndLogout');
}
</script>
<template>
	<Preferences @clear-preferences-and-logout="clearPreferencesAndLogout">
		<VbirdIconButton>
			<Settings class="text-foreground size-4" />
		</VbirdIconButton>
	</Preferences>
</template>
