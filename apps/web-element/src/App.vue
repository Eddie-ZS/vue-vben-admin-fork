<script setup lang="ts">
import { onMounted } from 'vue';

import { useNamespace } from '@vbird/hooks';

const { b, e } = useNamespace('menu');

onMounted(() => {});
</script>

<template>
	<div :class="[b()]">
		123
		<div :class="[e('item')]">456</div>
	</div>

	<div class="menu">
		999
		<div class="menuitem">125</div>
	</div>
</template>

<style lang="scss" scoped>
@include b('menu') {
	color: red;

	@include e('item') {
		color: blue;
	}
}
</style>
