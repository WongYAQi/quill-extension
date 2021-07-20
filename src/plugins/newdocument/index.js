import NewDocumentSvg from './newdocument.svg'
const PluginManager = require('../../core/plugin')
function NewDocumentPlugin () {
  let quill = this.quill
  let delta = new Delta()
    .delete(quill.scroll.length() - 1)
  quill.updateContents(delta, Quill.sources.USER)
  quill.focus()
}
NewDocumentPlugin._name = 'newdocument'
NewDocumentPlugin._icon = NewDocumentSvg

PluginManager.register(NewDocumentPlugin)
