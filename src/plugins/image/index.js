const PluginManager = require('../../core/plugin')
const ImageSVG = require('./image.svg')
const Dialog = require('./ui/Dialog')
function imagePlugin () {
  Dialog(this.quill).open()
}
imagePlugin._name = 'image'
imagePlugin._icon = ImageSVG

PluginManager.register(imagePlugin)
