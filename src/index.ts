import type { UnpluginFactory } from 'unplugin'
import type { Options } from './types'
import { createUnplugin } from 'unplugin'

export const unpluginFactory: UnpluginFactory<Options | undefined> = (options) => {
  // 仅处理 JS/TS 文件
  const transformInclude = (id: string): boolean => /\.(?:js|ts|jsx|tsx)$/.test(id)

  return {
    name: 'unplugin-dynamic-import',
    transformInclude,
    transform(code, id) {
      // 判断是否为 CJS 格式（优先 options.format，否则通过文件名简单判断）
      const isCjs = options?.format === 'cjs' || /\.cjs(?:\.js)?$/.test(id)
      if (!isCjs || !transformInclude(id)) {
        return null
      }

      // 用 AST 解析，兼容测试环境和真实插件环境
      let ast: any
      if (typeof this?.parse === 'function') {
        ast = this.parse(code)
      }
      if (!ast)
        return null

      // 收集所有 import() 节点
      const replacements: { start: number, end: number, source: string }[] = []
      function walk(node: any): void {
        if (node.type === 'ImportExpression') {
          replacements.push({
            start: node.start,
            end: node.end,
            source: code.slice(node.start, node.end),
          })
        }
        for (const key in node) {
          if (!Object.prototype.hasOwnProperty.call(node, key))
            continue
          const value = node[key]
          if (value && typeof value === 'object' && typeof value.type === 'string') {
            walk(value)
          }
          else if (Array.isArray(value)) {
            value.forEach((child) => {
              if (child && typeof child === 'object' && typeof child.type === 'string') {
                walk(child)
              }
            })
          }
        }
      }
      walk(ast)

      if (!replacements.length)
        return null

      // 逆序替换，避免位置错乱
      let transformed = code
      for (let i = replacements.length - 1; i >= 0; i--) {
        const { start, end, source } = replacements[i]
        // source 形如 import('foo')
        const argMatch = source.match(/import\s*\(([\s\S]+)\)/)
        if (argMatch) {
          transformed
            = `${transformed.slice(0, start)
            }Promise.resolve().then(() => require(${argMatch[1]}))${
              transformed.slice(end)}`
        }
      }

      return {
        code: transformed,
        map: null,
      }
    },
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
