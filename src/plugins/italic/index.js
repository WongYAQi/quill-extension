import Quill from 'quill'
import ItalicSVG from './italic.svg'
const PluginManager = require('../../core/plugin')
function italicPlugin () {
  this.quill.format('italic', true, Quill.sources.USER)
}
italicPlugin._name = 'italic'
italicPlugin._icon = ItalicSVG
italicPlugin._keyboard = ['i', 'ctrlKey']

PluginManager.register(italicPlugin)
