/* @flow */

import { inBrowser } from './dom'
import { saveScrollPosition } from './scroll'
import { genStateKey, setStateKey, getStateKey } from './state-key'
import { extend } from './misc'

// 检查浏览器支持情况
export const supportsPushState =
  inBrowser &&
  (function () {
    const ua = window.navigator.userAgent

    if (
      (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
      ua.indexOf('Mobile Safari') !== -1 &&
      ua.indexOf('Chrome') === -1 &&
      ua.indexOf('Windows Phone') === -1
    ) {
      return false
    }

    return window.history && typeof window.history.pushState === 'function'
  })()

export function pushState(url?: string, replace?: boolean) {
  // 保存当前滚动位置
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      // preserve existing history state as it could be overriden by the user
      // 简单的浅复制，history.state里保留的一般都是简单数据
      const stateCopy = extend({}, history.state)
      stateCopy.key = getStateKey() // 获得当前state的key
      history.replaceState(stateCopy, '', url) // 替换成新的url
    } else {
      // 创建一个新的key，并添加
      history.pushState({ key: setStateKey(genStateKey()) }, '', url)
    }
  } catch (e) {
    // 遇到错误就跳转并刷新页面
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

// replaceState会替换掉当前的url（包括记录也会被替换）
export function replaceState(url?: string) {
  pushState(url, true)
}
