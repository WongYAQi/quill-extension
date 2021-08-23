import closeSVG from '../assets/icons/close.svg'
import { SelectPopper } from '../core/popper'
import { DialogForm, FormItemInfos } from '../types/Dialog'
/**
 * 
 * @param {HTMLElement} content 
 * @param {*} title 
 * @param {*} width 
 * @param {*} height 
 * @param {*} fnSave 
 */
export default class Dialog {
  container: HTMLElement
  constructor (ref: HTMLElement, title: string, width = 1200, height = 650, fnSave?: () => void) {
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
}

function hideDialog (dialog: Dialog) {
  dialog.container.remove()
}

function createDialogHeader (title: string) {
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

function createDialogContent (ref: HTMLElement) {
  let content = document.createElement('div')
  content.classList.add('ql-dialog__main')

  content.appendChild(ref)

  return content
}

function createDialogFooter (dialog: Dialog, fnSave: () => void) {
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

// 定义一系列的Dialog 中使用的表单构造函数
/**
 * input
 * listbox
 * checkbox
 * icon
 * dropzone
 */
class FormSpec {
  type = ''
  model: Record<string, any>
  key: string
  label: string
  random: number
  dom: HTMLElement
  constructor (model: Record<string,any>, key: string, label: string) {
    this.model = model
    this.key = key
    this.label = label
    this.random =  Math.floor(Math.random() * Math.pow(10, 6))
  }
  makeContainer () {
    let dom = document.createElement('div')
    dom.classList.add('ql-tinymce-form-item')
    return dom
  }
  makeLabel (id: string) {
    let label = document.createElement('label')
    label.setAttribute('for', id)
    label.classList.add('ql-tinymce-form-label')
    label.innerText = this.label
    return label
  }
  getId () {
    return 'ql-tinymce-form-' + this.type + '-' + this.key + '-' + this.random
  }
}
class FormInput extends FormSpec {
  constructor (model: Record<string, any>, info: FormItemInfos) {
    super(model, info.key, info.label)
    this.type = info.type
    this.dom = this.renderDom()
  }
  renderDom () {
    let id = this.getId()
    let dom = this.makeContainer()
    let label = this.makeLabel(id)

    let input = document.createElement('input')
    input.setAttribute('type', 'input')
    input.setAttribute('id', id)
    input.classList.add('ql-tinymce-form-textfield')
    dom.appendChild(label)
    dom.appendChild(input)
    input.addEventListener("input", evt => {
      this.model[this.key] = evt.returnValue
    })
    return dom
  }
}

class FormCheckbox extends FormSpec {
  items
  constructor (model: Record<string, any>, info: { key: any; label: any; items: any }) {
    let { key, label, items } = info
    super(model, key, label)
    this.items = items
    this.dom = this.renderDom()
  }
  renderDom () {
    let dom = this.makeContainer()
    let label = this.makeLabel('')
    dom.appendChild(label)
    this.items.forEach((item: any) => {
      dom.appendChild(this.makeCheckbox(item))
    })
    return dom
  }
  /**
   * 
   * @param {{ label: String, name: String, value: String }} item 
   */
  makeCheckbox (item: { name: string }) {
    let labelCheckbox = document.createElement('label')
    let input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    input.setAttribute('id', this.getId())
    let label = document.createElement('label')
    label.setAttribute('for', this.getId())
    label.innerText = item.name
    labelCheckbox.appendChild(input)
    labelCheckbox.appendChild(label)

    input.addEventListener('change', evt => {
      console.log(evt)
    })

    return label
  }
}

/**
 * 对于 select 型，如何构建 popper 
 */
class FormSelect extends FormSpec {
  options
  constructor (model: Record<string, any>, info: FormItemInfos) {
    super(model, info.key, info.label)
    this.options = info.items
    this.dom = this.renderDom()
  }
  renderDom () {
    let id = this.getId()
    let container = this.makeContainer()
    let label = this.makeLabel(id)

    let input = document.createElement('input')
    input.classList.add('ql-tinymce-form-listbox')

    let popper = new SelectPopper(input, this.options)
    input.addEventListener('click', (evt) => {
      popper.show(evt)
    })

    container.appendChild(label)
    container.appendChild(input)
    return container
  }
}

const mapConstructor = new Map([
  ['input', FormInput],
  ['listbox', FormSelect]
])

export class Form {
  dom: HTMLElement
  constructor (model: Record<string, any>, infos: any[]) {
    this.dom = this.renderDom()
    infos.forEach((group: any[]) => {
      let formitem = new FormItem(model, group).dom
      this.dom.appendChild(formitem)
    })
  }
  renderDom () {
    let dom = document.createElement('form')
    dom.classList.add('ql-tinymce-form')
    return dom
  }
  renderItems () {

  }
}
class FormItem {
  dom: HTMLElement
  constructor (model: Record<string, any>, infos: FormItemInfos[]) {
    this.dom = this.renderDom()
    infos.forEach(info => {
        let FormConstructor = mapConstructor.get(info.type)
        if (FormConstructor) {
          let item = new FormConstructor(model, info).dom
          this.dom.appendChild(item)
        }
    })
  }
  renderDom () {
    let dom = document.createElement('div')
    dom.classList.add('ql-tinymce-form-group')
    return dom
  }
}
