import type { Preferences } from './types';

const defaultPreferences: Preferences = {
	app: {
		accessMode: 'frontend',
		authPageLayout: 'panel-right',
		checkUpdatesInterval: 1,
		colorGrayMode: false,
		colorWeakMode: false,
		compact: false,
		contentCompact: 'wide',
		defaultAvatar: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp',
		dynamicTitle: true,
		enableCheckUpdates: true,
		enablePreferences: true,
		enableRefreshToken: false,
		isMobile: false,
		layout: 'sidebar-nav',
		locale: 'zh-CN',
		loginExpiredMode: 'page',
		name: 'Vbird Admin',
		preferencesButtonPosition: 'auto',
		watermark: false
	},
	breadcrumb: {
		enable: true,
		hideOnlyOne: false,
		showHome: false,
		showIcon: true,
		styleType: 'normal'
	},
	copyright: {
		companyName: 'Vbird',
		companySiteLink: 'https://www.vben.pro',
		date: '2024',
		enable: true,
		icp: '',
		icpLink: '',
		settingShow: true
	},
	footer: {
		enable: false,
		fixed: false
	},
	header: {
		enable: true,
		hidden: false,
		menuAlign: 'start',
		mode: 'fixed'
	},
	logo: {
		enable: true,
		source: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp'
	},
	navigation: {
		accordion: true,
		split: true,
		styleType: 'rounded'
	},
	shortcutKeys: {
		enable: true,
		globalLockScreen: true,
		globalLogout: true,
		globalPreferences: true,
		globalSearch: true
	},
	sidebar: {
		autoActivateChild: false,
		collapsed: false,
		collapsedShowTitle: false,
		enable: true,
		expandOnHover: true,
		extraCollapse: false,
		hidden: false,
		width: 224
	},
	tabbar: {
		draggable: true,
		enable: true,
		height: 38,
		keepAlive: true,
		persist: true,
		showIcon: true,
		showMaximize: true,
		showMore: true,
		styleType: 'chrome',
		wheelable: true
	},
	theme: {
		builtinType: 'default',
		colorDestructive: 'hsl(348 100% 61%)',
		colorPrimary: 'hsl(212 100% 45%)',
		colorSuccess: 'hsl(144 57% 58%)',
		colorWarning: 'hsl(42 84% 61%)',
		mode: 'dark',
		radius: '0.5',
		semiDarkHeader: false,
		semiDarkSidebar: false
	},
	transition: {
		enable: true,
		loading: true,
		name: 'fade-slide',
		progress: true
	},
	widget: {
		fullscreen: true,
		globalSearch: true,
		languageToggle: true,
		lockScreen: true,
		notification: true,
		refresh: true,
		sidebarToggle: true,
		themeToggle: true
	}
};

export { defaultPreferences };
