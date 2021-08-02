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

PluginManager.register(textColorPlugin)
