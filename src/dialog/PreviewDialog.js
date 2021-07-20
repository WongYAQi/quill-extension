import Dialog from './Dialog'

/**
 * 从 quill 中拿到html
 * @param {Quill} quill 
 * @returns 
 */
export default function PreviewDialog (quill) {
  let content = document.createElement('div')
  content.style.width = '100%'
  content.style.height = '100%'
  content.style.overflow = 'auto'

  let text = document.createElement('div')
  text.innerHTML = quill.root.innerHTML

  content.appendChild(text)
  let dialog = new Dialog(content, 'Preview')
  document.body.appendChild(dialog.container)
}
