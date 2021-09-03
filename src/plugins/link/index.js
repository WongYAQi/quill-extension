const LinkSVG = require('./index.svg')
const PluginManager = require('../../core/plugin')
import Dialog from './ui/Dialog'
import Link from './format/link'
function LinkPlugin () {
  new Dialog(this.quill).open()
}
LinkPlugin._name = 'link'
LinkPlugin._icon = LinkSVG

PluginManager.register(LinkPlugin)
