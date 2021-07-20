import PreviewSvg from './preview.svg'
import PreviewDialog from '../../dialog/PreviewDialog'
const PluginManager = require('../../core/plugin')
function PreviewPlugin () {
  PreviewDialog(this.quill)
}
PreviewPlugin._name = 'preview'
PreviewPlugin._icon = PreviewSvg

PluginManager.register(PreviewPlugin)