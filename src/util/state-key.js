/* @flow */
import { inBrowser } from './dom'

// use User Timing api (if present) for more accurate key precision
const Time =
  inBrowser && window.performance && window.performance.now
    ? window.performance
    : Date

// 创建一个新的key
export function genStateKey(): string {
  return Time.now().toFixed(3)
}

let _key: string = genStateKey()

// 获取当前页面的key值
export function getStateKey() {
  return _key
}

// 设置key值
export function setStateKey(key: string) {
  return (_key = key)
}
