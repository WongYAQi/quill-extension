import ItalicSVG from './italic.svg'
const PluginManager = require('../../core/plugin')
function italicPlugin () {
  // do nothing
}
italicPlugin._name = 'italic'
italicPlugin._icon = ItalicSVG
italicPlugin._keyboard = ['i', 'ctrlKey']

PluginManager.register(italicPlugin)
