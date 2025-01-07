<script lang="ts" setup>
import { VbirdSpinner } from '@vbird-core/shadcn-ui';

import { useContentSpinner } from './use-content-spinner';

defineOptions({ name: 'LayoutContentSpinner' });

const { spinning } = useContentSpinner();
</script>
<template>
	<VbirdSpinner :spinning="spinning" />
</template>
