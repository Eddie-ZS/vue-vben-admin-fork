import type { BaseFormComponentType, ExtendedFormApi, VbirdFormProps } from './types';

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { useStore } from '@vbird-core/shared/store';

import { FormApi } from './form-api';
import VbirdUseForm from './vbird-use-form.vue';

export function useVbirdForm<T extends BaseFormComponentType = BaseFormComponentType>(options: VbirdFormProps<T>) {
	const IS_REACTIVE = isReactive(options);
	const api = new FormApi(options);
	const extendedApi: ExtendedFormApi = api as never;
	extendedApi.useStore = (selector) => {
		return useStore(api.store, selector);
	};

	const Form = defineComponent(
		(props: VbirdFormProps, { attrs, slots }) => {
			onBeforeUnmount(() => {
				api.unmount();
			});
			api.setState({ ...props, ...attrs });
			return () => h(VbirdUseForm, { ...props, ...attrs, formApi: extendedApi }, slots);
		},
		{
			inheritAttrs: false,
			name: 'VbirdUseForm'
		}
	);
	// Add reactivity support
	if (IS_REACTIVE) {
		watch(
			() => options.schema,
			() => {
				api.setState({ schema: options.schema });
			},
			{ immediate: true }
		);
	}

	return [Form, extendedApi] as const;
}
