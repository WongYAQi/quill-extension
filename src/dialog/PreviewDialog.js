import Dialog from './Dialog'

/**
 * 从 quill 中拿到html
 * @param {Quill} quill 
 * @returns 
 */
export default function PreviewDialog (quill) {
  let content = document.createElement('div')
  content.innerHTML = quill.root.innerHTML
  let dialog = new Dialog(content, 'Preview')
  document.body.appendChild(dialog.container)
}
