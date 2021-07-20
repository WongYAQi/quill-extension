import closeSVG from '../assets/icons/close.svg'
/**
 * 
 * @param {HTMLElement} content 
 * @param {*} title 
 * @param {*} width 
 * @param {*} height 
 * @param {*} fnSave 
 */
export default function Dialog (ref, title, width = 1200, height = 650, fnSave) {
  let container = document.createElement('div')
  let mask = document.createElement('div')
  let content = document.createElement('div')

  container.classList.add('ql-tinymce-dialog')
  mask.classList.add('ql-dialog__mask')
  content.classList.add('ql-dialog__content')

  if (width) content.style.width = width + 'px'
  if (height) content.style.height = height + 'px'

  container.appendChild(mask)
  mask.appendChild(content)
  content.appendChild(createDialogHeader(title))
  content.appendChild(createDialogContent(ref))
  content.appendChild(createDialogFooter(this, fnSave))

  if (fnSave) {
    // 存在 fnSave 的时候，才会有保存按钮
  }

  this.container = container
}

function hideDialog (dialog) {
  dialog.container.remove()
}

function createDialogHeader (title) {
  let header = document.createElement('div')
  let span = document.createElement('span')
  let close = document.createElement('i')
  span.innerHTML = title
  close.innerHTML = closeSVG
  span.classList.add('ql-dialog__text')
  close.classList.add('ql-dialog__text')
  header.appendChild(span)
  header.appendChild(close)

  header.classList.add('ql-dialog__header')
  return header
}

function createDialogContent (ref) {
  let content = document.createElement('div')
  content.classList.add('ql-dialog__main')

  content.appendChild(ref)

  return content
}

function createDialogFooter (dialog, fnSave) {
  let footer = document.createElement('div')
  let start = document.createElement('div')
  start.classList.add('ql-dialog__footer__start')
  let end = document.createElement('div')
  end.classList.add('ql-dialog__footer__end')

  footer.classList.add('ql-dialog__footer')

  let closeBtn = document.createElement('button')
  closeBtn.innerHTML = '关闭'
  closeBtn.classList.add('ql-dialog__button')
  closeBtn.addEventListener('click', evt => {
    hideDialog(dialog)
  })

  if (fnSave) {
    closeBtn.classList.add('secondary')
    let submitBtn = document.createElement('button')
    submitBtn.innerText = '保存'
    submitBtn.classList.add('ql-dialog__button')
    end.appendChild(submitBtn)
    submitBtn.addEventListener('click', evt => {
      fnSave()
    })
  }

  end.appendChild(closeBtn)
  footer.appendChild(start)
  footer.appendChild(end)
  return footer
}
