# unplugin-dynamic-import

[![NPM version](https://img.shields.io/npm/v/unplugin-dynamic-import?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-dynamic-import)
[![GitHub](https://img.shields.io/badge/GitHub-项目主页-181717?logo=github)](https://github.com/CaoMeiYouRen/unplugin-dynamic-import)

一个用于多种构建工具的动态 `import()` 转换的 Unplugin 插件。

## 特性

- 支持 Vite、Rollup、Webpack、Nuxt、Vue CLI、esbuild 等主流构建工具
- 零配置开箱即用
- 支持 TypeScript
- 轻量高效

## 安装

```bash
npm i unplugin-dynamic-import
# 或
yarn add unplugin-dynamic-import
# 或
pnpm add unplugin-dynamic-import
```

## 用法

根据你的构建工具选择对应的用法：

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import DynamicImport from 'unplugin-dynamic-import/vite'

export default defineConfig({
  plugins: [
    DynamicImport({ /* options */ }),
  ],
})
```

示例项目: [`playground/`](./playground/)

</details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import DynamicImport from 'unplugin-dynamic-import/rollup'

export default {
  plugins: [
    DynamicImport({ /* options */ }),
  ],
}
```

</details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  // ...existing code...
  plugins: [
    require('unplugin-dynamic-import/webpack')({ /* options */ })
  ]
}
```

</details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-dynamic-import/nuxt', { /* options */ }],
  ],
})
```

> 兼容 Nuxt 2 和 [Nuxt Vite](https://github.com/nuxt/vite)

</details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-dynamic-import/webpack')({ /* options */ }),
    ],
  },
}
```

</details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import DynamicImport from 'unplugin-dynamic-import/esbuild'

build({
  plugins: [DynamicImport()],
})
```

</details>

## 配置项

插件支持的配置项如下（可选）：

```ts
DynamicImport({
  // 你的自定义选项
})
```

## 贡献

欢迎提 [issue](https://github.com/CaoMeiYouRen/unplugin-dynamic-import/issues) 或 [PR](https://github.com/CaoMeiYouRen/unplugin-dynamic-import/pulls)！

## License

Copyright © 2025 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [MIT](https://github.com/CaoMeiYouRen/unplugin-dynamic-import/blob/master/LICENSE) licensed.