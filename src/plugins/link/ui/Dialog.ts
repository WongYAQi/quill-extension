import Quill from "quill"
import { Form } from "../../../dialog/Dialog"
import { FormItemInfos } from "../../../types/Dialog"
import DialogCore from '../../../dialog/Dialog'

const linkUrl: FormItemInfos = {
  type: 'input',
  label: 'URL',
  key: 'url'
}
const linkText: FormItemInfos = {
  type: 'input',
  label: 'Text to display',
  key: 'text'
}
const linkTitle: FormItemInfos = {
  type: 'input',
  label: 'Title',
  key: 'title'
}
const linkTarget: FormItemInfos = {
  type: 'listbox',
  label: 'Open Link in...',
  key: 'target',
  items: [
    { label: 'Current window', value: '_self' },
    { label: 'New window', value: '_blank' }
  ]
}
const FormProps = [
  [linkUrl],
  [linkText],
  [linkTitle],
  [linkTarget]
]
export default class Dialog {
  quill: Quill
  form: { source: string; decorative: any[]; description: string; width: string; height: string; isLock: boolean; captions: any[]; class: string }
  dom: HTMLElement
  constructor (quill: Quill) {
    this.quill = quill
    this.form = {
      source: '',
      decorative: [],
      description: '',
      width: '',
      height: '',
      isLock: false,
      captions: [],
      class: ''
    }
    let form = new Form(this.form, FormProps)
    this.dom = new DialogCore(form.dom, '新增链接', 400, 400, this.save).container
  }
  open () {
    document.body.appendChild(this.dom)
  }
  // 保存的时候在当前位置创建一个 text 超链接
  save () {
  }
}
