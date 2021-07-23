import Quill from 'quill'
const Inline = Quill.import('blots/inline')

class CodeSpan extends Inline {
  static create () {
    let dom = super.create()
    dom.style.backgroundColor = 'green'
    return dom
  }
}
CodeSpan.tagName = 'SPAN'
CodeSpan.blodName = 'code-span'

export default CodeSpan
