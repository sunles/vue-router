/* @flow */

import { inBrowser } from './dom'
import { saveScrollPosition } from './scroll'

export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent
  const str = "baiduboxapp/1";
  const len = str.length +1;
  const baiduVersion = ua.substr(ua.indexOf(str),len).substr(len-2,2);

  if (
    (ua.indexOf(str) !== -1 && baiduVersion < 11) ||
    ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1 || ua.indexOf('Android 5.') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1)
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})()

// use User Timing api (if present) for more accurate key precision
const Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date

let _key: string = genKey()

function genKey (): string {
  return Time.now().toFixed(3)
}

export function getStateKey () {
  return _key
}

export function setStateKey (key: string) {
  _key = key
}

export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history

  const str = "baiduboxapp/1";
  const len = str.length +1;
  const ua = window.navigator.userAgent
  const baiduVersion = ua.substr(ua.indexOf(str),len).substr(len-2,2);
  //用于解决百度手机app版本低于11的客户端，不支持pushstate的问题
  if (
    (ua.indexOf(str) !== -1 && baiduVersion < 11) ||
    ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1 || ua.indexOf('Android 5.') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1)
  ) {
    window.location[replace ? 'replace' : 'assign'](url)
  }else{
    try {
      if (replace) {
        history.replaceState({ key: _key }, '', url)
      } else {
        _key = genKey()
        history.pushState({ key: _key }, '', url)
      }
    } catch (e) {
      window.location[replace ? 'replace' : 'assign'](url)
    }
  }
  
}

export function replaceState (url?: string) {
  pushState(url, true)
}
