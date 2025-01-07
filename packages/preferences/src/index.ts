import type { Preferences } from '@vbird-core/preferences';
import type { DeepPartial } from '@vbird-core/typings';

/**
 * 如果你想所有的app都使用相同的默认偏好设置，你可以在这里定义
 * 而不是去修改 @vbird-core/preferences 中的默认偏好设置
 * @param preferences
 * @returns
 */

function defineOverridesPreferences(preferences: DeepPartial<Preferences>) {
	return preferences;
}

export { defineOverridesPreferences };

export * from '@vbird-core/preferences';
