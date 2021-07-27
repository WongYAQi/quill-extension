const PluginManager = require('../../core/plugin')

function FontsizesPlugin () {
  
}
FontsizesPlugin._name = 'fontsizes'
FontsizesPlugin._options = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']

PluginManager.register(FontsizesPlugin)
