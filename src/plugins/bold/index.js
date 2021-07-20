import BoldSvg from './bold.svg'
import Quill from 'quill'
import Delta from 'quill-delta'
const PluginManager = require('../../core/plugin')

function BoldPlugin (range, context) {
  // do nothing, 原生已经有了
}

BoldPlugin._name = 'bold'
BoldPlugin._icon = BoldSvg
BoldPlugin._keyboard = ['b', 'ctrlKey']

PluginManager.register(BoldPlugin)
