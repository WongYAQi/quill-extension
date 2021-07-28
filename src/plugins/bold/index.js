import BoldSvg from './bold.svg'
import Quill from 'quill'
import Delta from 'quill-delta'
const PluginManager = require('../../core/plugin')

function BoldPlugin () {
  this.quill.format('bold', true, Quill.sources.USER)
}

BoldPlugin._name = 'bold'
BoldPlugin._icon = BoldSvg
BoldPlugin._keyboard = ['b', 'ctrlKey']

PluginManager.register(BoldPlugin)
