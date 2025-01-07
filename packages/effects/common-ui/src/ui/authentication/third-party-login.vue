<script setup lang="ts">
import { MdiGithub, MdiGoogle, MdiQqchat, MdiWechat } from '@vbird/icons';
import { $t } from '@vbird/locales';

import { VbirdIconButton } from '@vbird-core/shadcn-ui';

defineOptions({
	name: 'ThirdPartyLogin'
});
</script>

<template>
	<div class="w-full sm:mx-auto md:max-w-md">
		<div class="mt-4 flex items-center justify-between">
			<span class="border-input w-[35%] border-b dark:border-gray-600"></span>
			<span class="text-muted-foreground text-center text-xs uppercase">
				{{ $t('authentication.thirdPartyLogin') }}
			</span>
			<span class="border-input w-[35%] border-b dark:border-gray-600"></span>
		</div>

		<div class="mt-4 flex flex-wrap justify-center">
			<VbirdIconButton class="mb-3">
				<MdiWechat />
			</VbirdIconButton>
			<VbirdIconButton class="mb-3">
				<MdiQqchat />
			</VbirdIconButton>
			<VbirdIconButton class="mb-3">
				<MdiGithub />
			</VbirdIconButton>
			<VbirdIconButton class="mb-3">
				<MdiGoogle />
			</VbirdIconButton>
		</div>
	</div>
</template>
