module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "babel-eslint",
  "extends": ["react-app", "airbnb-base"],
  /**
   * "off" 或 0 - 关闭规则
   * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
   * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
   */
  "rules": {
    "import/no-dynamic-require":0,
    "no-restricted-syntax":0,// 关闭 for...of 限制，与其他厂不同
    "no-prototype-builtins":0,
    "no-bitwise":0,
    "camelcase":0,
    "quotes": 0,
    "no-console": 0,
    "func-names": 0,
    "no-plusplus": 0,
    "no-continue": 0,
    "comma-dangle": 0,
    "arrow-parens": 0,
    "no-fallthrough": 0,
    "global-require": 0,
    "arrow-body-style": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "operator-linebreak": 0,
    "import/no-unresolved": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": 0,
    "space-before-function-paren": 0,
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": 0,
    "max-classes-per-file": 0,
    "no-use-before-define": [
      "error",
      {
        "functions": false,
        "variables": false
      }
    ],
    "no-nested-ternary": 1,// 不允许使用嵌套的三元表达式
    "max-len": 0,
    "react/jsx-no-duplicate-props":1,
    "react/state-in-constructor": 0,
    "react/prop-types": 2,//防止在React组件定义中丢失props验证
    "react/no-danger": 0,
    "react/sort-comp": 0,
    "react/no-multi-comp": 0,
    "react/self-closing-comp": 0,
    "react/forbid-prop-types": 0,
    "react/no-array-index-key": 0,
    "react/no-unused-prop-types": 1,// 禁止未使用的prop types
    "react/no-unused-state": 1,// 禁止未使用的state
    "react/jsx-props-no-spreading": 0,
    "react/no-render-return-value": 0,
    "react/destructuring-assignment": 0,
    "react/jsx-filename-extension": 0,
    "react/static-property-placement": 0,
    "class-methods-use-this": 0,
    "no-lonely-if": 0,
    "function-paren-newline": 0,
    "object-curly-newline": 0,
    "prefer-destructuring": 0,
    "jsx-quotes": 2,
    "jsx-a11y/alt-text": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/no-autofocus": 0,
    "linebreak-style": ["off", "windows"]
  }
};
