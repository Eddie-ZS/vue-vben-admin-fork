import { createApp } from 'vue';

// 导入css样式
import '@vbird/styles';
// 导入自定义 element-plus 样式文件
import '@vbird/styles/ele';

import App from './App.vue';

export async function bootstrap(namespace: string) {
	const app = createApp(App);

	app.mount('#app');
}
