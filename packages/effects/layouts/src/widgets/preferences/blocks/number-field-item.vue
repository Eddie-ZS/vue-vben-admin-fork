<script setup lang="ts">
import type { SelectOption } from '@vbird/types';

import { useSlots } from 'vue';

import { CircleHelp } from '@vbird/icons';

import {
	NumberField,
	NumberFieldContent,
	NumberFieldDecrement,
	NumberFieldIncrement,
	NumberFieldInput,
	VbirdTooltip
} from '@vbird-core/shadcn-ui';

defineOptions({
	name: 'PreferenceSelectItem'
});

withDefaults(
	defineProps<{
		disabled?: boolean;
		items?: SelectOption[];
		placeholder?: string;
	}>(),
	{
		disabled: false,
		placeholder: '',
		items: () => []
	}
);

const inputValue = defineModel<number>();

const slots = useSlots();
</script>

<template>
	<div
		:class="{
			'hover:bg-accent': !slots.tip,
			'pointer-events-none opacity-50': disabled
		}"
		class="my-1 flex w-full items-center justify-between rounded-md px-2 py-1">
		<span class="flex items-center text-sm">
			<slot></slot>

			<VbirdTooltip v-if="slots.tip" side="bottom">
				<template #trigger>
					<CircleHelp class="ml-1 size-3 cursor-help" />
				</template>
				<slot name="tip"></slot>
			</VbirdTooltip>
		</span>

		<NumberField v-model="inputValue" v-bind="$attrs" class="w-[165px]">
			<NumberFieldContent>
				<NumberFieldDecrement />
				<NumberFieldInput />
				<NumberFieldIncrement />
			</NumberFieldContent>
		</NumberField>
	</div>
</template>
