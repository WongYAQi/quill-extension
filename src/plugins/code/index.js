import Quill from 'quill'
import Delta from 'quill-delta'
import CodeSVG from './code.svg'
const PluginManager = require('../../core/plugin')

/**
 * 将 当前selection 的range变为 code format
 */
function codePlugin () {
  this.quill.focus()
  const [range] = this.quill.selection.getRange()
  console.log(range)
  this.quill.updateContents(
    new Delta()
      .retain(range.index)
      .insert({ ['code-span']: 'asasd' }),
    Quill.sources.USER
  )
}
codePlugin._name = 'code'
codePlugin._icon = CodeSVG

PluginManager.register(codePlugin)
