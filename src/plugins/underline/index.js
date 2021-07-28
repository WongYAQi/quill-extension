import Quill from 'quill'
import UnderlineSVG from './underline.svg'
const PluginManager = require('../../core/plugin')

function underlinePlugin () {
  this.quill.format('underline', true, Quill.sources.USER)
}
underlinePlugin._name = 'underline'
underlinePlugin._icon = UnderlineSVG
underlinePlugin._keyboard = ['U', 'ctrlKey']

PluginManager.register(underlinePlugin)