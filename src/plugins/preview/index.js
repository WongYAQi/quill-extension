import PreviewSvg from './preview.svg'
import PreviewDialog from '../../dialog/PreviewDialog'
const PluginManager = require('../../core/plugin')
function PreviewPlugin (quill) {
  PreviewDialog(quill)
}
PreviewPlugin._name = 'preview'
PreviewPlugin._icon = PreviewSvg

PluginManager.register(PreviewPlugin)