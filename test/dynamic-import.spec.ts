import * as acorn from 'acorn'
import { createUnplugin } from 'unplugin'
import { describe, expect, it } from 'vitest'
import { unpluginFactory } from '../src/index'

describe('unplugin-dynamic-import', () => {
  const code = `
    const foo = import('foo')
    const bar = import("bar")
    const baz = import(\`baz\`)
    // import('not-a-real-import')
    function test() {
      return import('test')
    }
  `

  const unplugin = createUnplugin(unpluginFactory)

  function getTransform(plugin: any) {
    // 兼容 unplugin 返回数组或单对象的情况
    if (Array.isArray(plugin)) {
      return plugin[0]?.transform
    }
    return plugin.transform
  }

  // 注入 this.parse，兼容测试环境
  function withParseContext<T extends (...args: any[]) => any>(fn: T): T {
    return function (this: any, ...args: Parameters<T>): ReturnType<T> {
      const ctx = {
        parse(code: string) {
          // acorn 需要 ranges和locations才能有start/end属性
          return acorn.parse(code, {
            ecmaVersion: 'latest',
            sourceType: 'module',
            locations: false,
            ranges: false,
          })
        },
      }
      return fn.apply(ctx, args)
    } as T
  }

  it('should not transform in esm mode', () => {
    const plugin = unplugin.raw({ format: 'esm' }, { framework: 'rollup' })
    const transform = getTransform(plugin)
    const result = withParseContext(transform)?.(code, 'file.js')
    expect(result).toBeNull()
  })

  it('should transform in cjs mode', () => {
    const plugin = unplugin.raw({ format: 'cjs' }, { framework: 'rollup' })
    const transform = getTransform(plugin)
    const result = withParseContext(transform)?.(code, 'file.js')
    expect(result?.code).toContain('Promise.resolve().then(() => require(\'foo\'))')
    expect(result?.code).toContain('Promise.resolve().then(() => require("bar"))')
    expect(result?.code).toContain('Promise.resolve().then(() => require(`baz`))')
    expect(result?.code).toContain('Promise.resolve().then(() => require(\'test\'))')
    // 注释中的 import 不应被替换
    expect(result?.code).toContain('// import(\'not-a-real-import\')')
  })

  it('should not transform non-js/ts files', () => {
    const plugin = unplugin.raw({ format: 'cjs' }, { framework: 'rollup' })
    const transform = getTransform(plugin)
    const result = withParseContext(transform)?.(code, 'file.json')
    expect(result).toBeNull()
  })
})
