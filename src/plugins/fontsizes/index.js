import Quill from 'quill'
const PluginManager = require('../../core/plugin')

function FontsizesPlugin (value) {
  this.quill.format('fontsizes', value, Quill.sources.USER)
}
FontsizesPlugin._name = 'fontsizes'
FontsizesPlugin._options = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']
FontsizesPlugin._blotName = 'fontsizes'

PluginManager.register(FontsizesPlugin)
