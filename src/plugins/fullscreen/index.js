import FullScreenSVG from './fullscreen.svg'
const PluginManager = require('../../core/plugin')

/**
 * 存在 context, 说明是通过快捷键触发的
 * @param {*} quill 
 */
function fullscreenPlugin (range, context) {
  this.quill.boundary.classList.toggle('fullscreen')
}

fullscreenPlugin._name = 'fullscreen'
fullscreenPlugin._icon = FullScreenSVG
fullscreenPlugin._check = false

PluginManager.register(fullscreenPlugin)