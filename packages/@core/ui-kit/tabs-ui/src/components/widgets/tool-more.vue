<script lang="ts" setup>
import type { DropdownMenuProps } from '@vbird-core/shadcn-ui';

import { ChevronDown } from '@vbird-core/icons';
import { VbirdDropdownMenu } from '@vbird-core/shadcn-ui';

defineProps<DropdownMenuProps>();
</script>

<template>
	<VbirdDropdownMenu :menus="menus" :modal="false">
		<div
			class="flex-center hover:bg-muted hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold">
			<ChevronDown class="size-4" />
		</div>
	</VbirdDropdownMenu>
</template>
