module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  // // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  // extends: ['plugin:vue/essential', 'standard'],
  env: {
    'browser': true,
    'commonjs': true,
    'amd': true,
    'jquery': true,
    'es6': true
  },
  // plugins: [
  //   'vue'
  // ],
  // globals: {

  // },
  rules: {
    'indent': ['warn', 2, {                             // 两个空格
      'SwitchCase': 1,                                  // Switch 与 Case 要有缩进
      'VariableDeclarator': {                           // 多行 var let const 对齐第一个单词
        'var': 2,
        'let': 2,
        'const': 3,
      },
      'outerIIFEBody': 2,                               // IIFE 函数的内容要缩进
      'ImportDeclaration': 'off',                       // 不检查 import 缩进
    }],
    'camelcase': ['warn', {                             // 变量名使用驼峰
      'allow': [
        
      ],
      'properties': 'never',                            // 不强制属性名为驼峰
      'ignoreDestructuring': true,                      // 不检查解构标识符
    }],
    'semi': ['warn', 'never'],                          // 不使用分号
    'comma-style': ['warn'],                            // 要求逗号放在数组元素、对象属性或变量声明之后，且在同一行
    // 'comma-dangle': ['warn', 'always-multiline'],       // 多行使用拖尾逗号，考虑到 IE 暂且不要求
    'comma-spacing': ['warn'],                          // 禁止在逗号前使用空格，要求在逗号后使用一个或多个空格
    'eol-last': ['warn', 'always'],                     // 文件结尾需要换行符
    'key-spacing': ['warn'],                            // 禁止在对象字面量的键和冒号之间存在空格，要求在对象字面量的冒号和值之间存在至少有一个空格，强制在冒号前后只有一个空格
    // 'new-cap': ['warn', {                               // 要求构造函数首字母大写
    //   'properties': false,                              // 不检查对象，兼容 express.Router()
    // }],                                
    'block-spacing': ['warn', 'always'],                // 开括号前和闭括号后有空格
    'brace-style': ['warn', '1tbs', {                   // 使用 one true brace style 风格
      'allowSingleLine': true,                          // 允许开括号和闭括号在同一行
    }],
    'computed-property-spacing': ['warn'],              // 禁止在计算属性里使用空格
    'func-call-spacing': ['warn'],                      // 禁止在函数名和开括号之间有空格
    'object-curly-spacing': ['warn', 'always'],         // 对象字面量、解构赋值 和 import/export 说明符的花括号中使用一致的空格
    'new-parens': ['warn'],                             // 构造函数无参数时也需要括号
    'space-infix-ops': ['warn'],                        // 操作符前后需要空格
    'quotes': ['warn', 'single', { allowTemplateLiterals: true }],                       // 单引号, 允许模板字面量
    'vue/no-v-html': 'off',                             // 关闭禁止 v-html
    'no-duplicate-case': 2,                             //switch中的case标签不能重复
    'no-dupe-keys': 2,                                  //在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-dupe-args': 2,                                  //函数参数不能重复
    'no-unused-vars': [2, { 'vars': 'all', 'args': 'after-used' }], //不能有声明后未被使用的变量或参数
    'no-use-before-define': 2,                          //未定义前不能使用
    // 'vue/order-in-components': ['warn', {               // vue 组件/实例顺序
    //   'order': [
    //     'el',
    //     'name',
    //     'parent',
    //     'functional',
    //     ['delimiters', 'comments'],
    //     ['components', 'directives', 'filters'],
    //     'extends',
    //     'mixins',
    //     'inheritAttrs',
    //     'model',
    //     ['props', 'propsData'],
    //     'fetch',
    //     'asyncData',
    //     'data',
    //     'computed',
    //     'watch',
    //     'LIFECYCLE_HOOKS',
    //     'methods',
    //     'head',
    //     ['template', 'render'],
    //     'renderError',
    //   ],
    // }],
    // 'vue/attributes-order': ['warn', {                  // 属性顺序
    //   'order': [
    //     'DEFINITION',
    //     'LIST_RENDERING',
    //     'CONDITIONALS',
    //     'RENDER_MODIFIERS',
    //     'GLOBAL',
    //     'UNIQUE',
    //     'TWO_WAY_BINDING',
    //     'OTHER_DIRECTIVES',
    //     'OTHER_ATTR',
    //     'EVENTS',
    //     'CONTENT',
    //   ],
    //   'alphabetical': false,                            // 关闭按字母顺序
    // }],
    // 'vue/html-self-closing': ['warn', {                 // 自闭合
    //   'html': {
    //     'normal': 'never',                              // 普通 HTML 标签无需闭合
    //     'void': 'always',
    //   },
    // }],
    
  },
}
