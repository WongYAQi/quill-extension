const PluginManager = require('../../core/plugin')
import LeftSVG from './left.svg'
import RightSVG from './right.svg'
import CenterSVG from './center.svg'
import JustifySVG from './justify.svg'
import Quill from 'quill'

/**
 * @param {*} value 
 */
function AlignPlugin (value) {
  this.quill.format('align', value === 'left' ? false : value, Quill.sources.USER)
}
AlignPlugin._name = 'align'
AlignPlugin._options = ['left', 'center', 'right', 'justify']
AlignPlugin._icon = {
  left: LeftSVG,
  right: RightSVG,
  center: CenterSVG,
  justify: JustifySVG,
  align: ''
}
AlignPlugin._blotName = 'align'

PluginManager.register(AlignPlugin)
