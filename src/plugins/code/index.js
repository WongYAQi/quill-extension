import Quill from 'quill'
import Delta from 'quill-delta'
import CodeSVG from './code.svg'
const PluginManager = require('../../core/plugin')

/**
 * 将 当前selection 的range变为 code format
 */
function codePlugin () {
  this.quill.format('code-span', true, Quill.sources.USER)
}
codePlugin._name = 'code'
codePlugin._blotName = 'code-span'
codePlugin._icon = CodeSVG
codePlugin._check = false

PluginManager.register(codePlugin)
