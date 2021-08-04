import Quill from 'quill'
import SVG from './icon.svg'
const PluginManager = require('../../core/plugin')

function clearFormattingPlugin (evt) {
  this.quill.focus()
  const range = this.quill.getSelection();
  if (range == null) return;
  if (range.length === 0) {
    const formats = this.quill.getFormat();
    Object.keys(formats).forEach(name => {
      // Clean functionality in existing apps only clean inline formats
      if (this.quill.scroll.query(name, Scope.INLINE) != null) {
        this.quill.format(name, false, Quill.sources.USER);
      }
    });
  } else {
    this.quill.removeFormat(range, Quill.sources.USER);
  }
}

clearFormattingPlugin._name = 'clearformatting'
clearFormattingPlugin._icon = SVG
PluginManager.register(clearFormattingPlugin)
