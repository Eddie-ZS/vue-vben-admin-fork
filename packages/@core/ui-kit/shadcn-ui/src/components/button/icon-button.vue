<script setup lang="ts">
import type { ButtonVariants } from '../../ui';
import type { VbirdButtonProps } from './button';

import { computed, useSlots } from 'vue';

import { cn } from '@vbird-core/shared/utils';

import { VbirdTooltip } from '../tooltip';
import VbirdButton from './button.vue';

interface Props extends VbirdButtonProps {
	class?: any;
	disabled?: boolean;
	onClick?: () => void;
	tooltip?: string;
	tooltipDelayDuration?: number;
	tooltipSide?: 'bottom' | 'left' | 'right' | 'top';
	variant?: ButtonVariants;
}

const props = withDefaults(defineProps<Props>(), {
	disabled: false,
	onClick: () => {},
	tooltipDelayDuration: 200,
	tooltipSide: 'bottom',
	variant: 'icon'
});

const slots = useSlots();

const showTooltip = computed(() => !!slots.tooltip || !!props.tooltip);
</script>

<template>
	<VbirdButton
		v-if="!showTooltip"
		:class="cn('rounded-full', props.class)"
		:disabled="disabled"
		:variant="variant"
		size="icon"
		@click="onClick">
		<slot></slot>
	</VbirdButton>

	<VbirdTooltip v-else :delay-duration="tooltipDelayDuration" :side="tooltipSide">
		<template #trigger>
			<VbirdButton :class="cn('rounded-full', props.class)" :disabled="disabled" :variant="variant" size="icon" @click="onClick">
				<slot></slot>
			</VbirdButton>
		</template>
		<slot v-if="slots.tooltip" name="tooltip"> </slot>
		<template v-else>
			{{ tooltip }}
		</template>
	</VbirdTooltip>
</template>
