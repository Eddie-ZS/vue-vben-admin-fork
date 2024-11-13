import type { Linter } from 'eslint';
import { inferOpDefault } from '../util';

export async function vue(): Promise<Linter.Config[]> {
  const [tsEslint, vuePlugin, vueParser] = await Promise.all([
    inferOpDefault(import('typescript-eslint')),
    inferOpDefault(import('eslint-plugin-vue')),
    inferOpDefault(import('vue-eslint-parser')),
  ] as const);
  return [
    {
      files: ['**/*.vue'],
      languageOptions: {
        parser: vueParser,
        parserOptions: {
          /** typescript项目需要用到这个 */
          parser: tsEslint.parser,
          ecmaVersion: 'latest',
          extraFileExtensions: ['.vue'],
          ecmaFeatures: {
            jsx: true,
          },
          sourceType: 'module',
        },
      },
      plugins: {
        vue: vuePlugin,
      },
      processor: vuePlugin.processors['.vue'],
      rules: {
        ...vuePlugin.configs.base.rules, // 基础规则
        ...vuePlugin.configs['vue3-essential'].rules,
        ...vuePlugin.configs['vue3-strongly-recommended'].rules,
        ...vuePlugin.configs['vue3-recommended'].rules,
        'vue/attribute-hyphern': [
          'error',
          'always',
          {
            ignore: [],
          },
        ],
        'vue/no-mutating-props': [
          'error',
          {
            shallowOnly: true,
          },
        ],
        // 块的顺序
        'vue/block-order': [
          'error',
          {
            order: ['script', 'template', 'style'],
          },
        ],
        // 标签的第一个属性必须另起一行
        'vue/first-attribute-linebreak': [
          'error',
          {
            singleline: 'ignore', // 单行标签的第一个属性不允许另起一行
            multiline: 'below', // 多行标签的第一个属性必须另起一行
          },
        ],
        // 标签的右括号前使用换行符
        'vue/html-closing-bracket-newline': [
          'error',
          {
            singleline: 'never', // 单行标签的右括号前不允许有换行符
            multiline: 'never', // 多行标签的右括号前不允许有换行符
            selfClosingTag: {
              singleline: 'never', // 自闭合标签的右括号前不允许有换行符
              multiline: 'never', // 自闭合标签的右括号前不允许有换行符
            },
          },
        ],
        // 标签的右括号前使用空格规则
        'vue/html-closing-bracket-spacing': [
          'error',
          {
            startTag: 'never', // 开始标签的右括号前不允许有空格
            endTag: 'never', // 结束标签的右括号前不允许有空格
            selfClosingTag: 'always', // 自闭合标签的右括号前必须有空格
          },
        ],
        'vue/attributes-order': 'off', // 标签属性顺序不强制要求
        'vue/html-end-tags': 'error', // 标签必须正确闭合
        'vue/eqeqeq': ['error', 'smart'], // 必须使用全等
        'vue/html-indent': ['error', 2], // 标签缩进必须为2个空格
        'vue/html-quotes': ['error', 'double'], // 标签属性值使用双引号
        'vue/component-name-in-template-casing': ['error', 'PascalCase'], // 模板中的组件名称必须使用PascalCase命名法
        'vue/component-options-name-casing': ['error', 'PascalCase'], // 组件选项名称必须使用PascalCase命名法
        'vue/custom-event-name-casing': ['error', 'camelCase'], // 自定义事件名称必须使用驼峰命名法
        // 使用自闭合样式
        'vue/html-self-closing': [
          'error',
          {
            html: {
              void: 'always', // 无内容元素必须自闭合
              normal: 'never', // 正常元素必须自闭合
              component: 'always', // 组件元素必须自闭合
            },
            svg: 'always',
            math: 'always',
          },
        ],
        // 定义的宏的顺序
        'vue/define-macros-order': [
          'error',
          {
            order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
          },
        ],
        'vue/max-attributes-per-line': 'off', // 单行标签属性数量不限制
        'vue/multi-word-component-names': 'off', // 组件名称允许使用多个单词
        'vue/multiline-html-element-content-newline': 'error', // 多行标签内容必须另起一行
        'vue/no-empty-pattern': 'error', // 禁止使用空解构模式
        'vue/no-extra-parens': ['error', 'functions'], // 禁止多余的括号
        'vue/no-irregular-whitespace': 'error', // 禁止不规则的空白符
        'vue/no-loss-of-precision': 'error', // 禁止数字丢失精度
        'vue/no-reserved-component-names': 'off', // 禁止使用保留字命名组件
        // 禁止使用特定语法
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'], // 不允许在 v-bind 中使用特定参数
        'vue/no-unsupported-features': 'error', // 禁止使用不支持的语法
        'vue/no-unused-refs': 'error', // 禁止未使用的 ref
        'vue/no-use-v-else-with-v-for': 'error', // 禁止 v-else-if 和 v-for 一起使用
        'vue/no-useless-v-bind': 'error', // 禁止没有必要的 v-bind
        // 对象语法简写
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true, // 避免使用引号
            ignoreConstructors: false, // 允许使用构造函数
          },
        ],
        'vue/one-component-per-file': 'error', // 每个文件只允许定义一个组件
        'vue/prefer-separate-static-class': 'error', // 静态类必须单独定义
        'vue/prefer-template': 'error', // 必须使用模板字面量
        'vue/prop-name-casing': ['error', 'camelCase'], // 组件属性名称必须使用驼峰命名法
        'vue/require-explicit-emits': 'error', // 组件必须显式声明 emits
        'vue/require-prop-types': 'off', // 组件必须显式声明 props
        'vue/singleline-html-element-content-newline': 'off', // 单行标签内容不允许另起一行
        'vue/space-infix-ops': 'error', // 运算符前后必须有空格
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }], // 一元运算符前后必须有空格
        // v-on 事件名称必须使用连字符连接
        'vue/v-on-event-hyphenation': [
          'error',
          'always',
          {
            autofix: true, // 自动修复
            ignore: [], // 忽略的事件名称
          },
        ],
      },
    },
  ];
}
