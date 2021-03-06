import Quill from 'quill'
import TextColorSVG from './textcolor.svg'
const PluginManager = require('../../core/plugin')
const { rgbToHex } = require('../../utils')

function textColorPlugin (evt) {
  if (evt.target instanceof HTMLElement && evt.target.classList.contains('ql-color-item')) {
    let color = evt.target.style.backgroundColor
    let colors = color.replace(/rgb\(/, '').replace(/\)/, '').split(',')
    let hex = rgbToHex(...colors)
    this.quill.format('color', hex, Quill.sources.USER)
  }
}

textColorPlugin._name = 'textcolor'
textColorPlugin._icon = TextColorSVG
textColorPlugin._colors = [
  ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00'],
  ['#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc'],
  ['#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966'],
  ['#888888', '#a10000', '#b26b00', '#b2b200', '#006100']
]

PluginManager.register(textColorPlugin)
