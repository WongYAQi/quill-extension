import BoldSvg from './bold.svg'
import Quill from 'quill'
import Delta from 'quill-delta'
const PluginManager = require('../../core/plugin')

/**
 * 如何将自定义事件和原生事件连接起来？
 * 原生事件需要 range 和 context 
 * 如何保证 click 后 selection 没有被清除
 * @param {*} quill 
 */
function BoldPlugin (quill) {
  let delta = new Delta()
    .delete(quill.scroll.length() - 1)
  quill.updateContents(delta, Quill.sources.USER)
  quill.focus()
}
BoldPlugin._name = 'bold'
BoldPlugin._icon = BoldSvg

PluginManager.register(BoldPlugin)
