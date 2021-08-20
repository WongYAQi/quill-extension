const DialogCore = require('../../../dialog/Dialog.ts')

module.exports = class Dialog {
  constructor (quill) {
    let content = document.createElement('div')
    content.style.width = '100%'
    content.style.height = '100%'
    content.style.overflow = 'auto'

    let text = document.createElement('div')
    text.innerHTML = quill.root.innerHTML

    content.appendChild(text)
    this.dialog = new DialogCore(content, 'Preview')
  }
  open () {
    document.body.appendChild(this.dialog.container)
  }
}
