import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => ({
  name: 'unplugin-dynamic-import',
  transformInclude(id) {
    // 仅处理 JS/TS 文件
    return /\.(?:js|ts|jsx|tsx)$/.test(id)
  },
  transform(code, id) {

  },
})

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
