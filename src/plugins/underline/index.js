import UnderlineSVG from './underline.svg'
const PluginManager = require('../../core/plugin')

function underlinePlugin () {
  // do nothing
}
underlinePlugin._name = 'underline'
underlinePlugin._icon = UnderlineSVG
underlinePlugin._keyboard = ['U', 'ctrlKey']

PluginManager.register(underlinePlugin)