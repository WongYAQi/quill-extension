import Quill from 'quill'
const Inline = Quill.import('blots/inline')
import { css } from '../utils'

/**
 * 将 CodeSpan 作为 format 型的blot
 * 如何在 create 的时候加入了value，那么在外部就不能通过 quill.format 的方式来格式化
 * 只有在通过 setContents 的时候，才会用到这个 create 
 */
class CodeSpan extends Inline {
  static create (value) {
    let dom = super.create()
    dom.classList.add('code-span')
    css(dom, {
      backgroundColor: '#b4d7ff',
      borderRadius: '3px',
      padding: '.1rem .2rem'
    })
    return dom
  }
  formats () {
    return {
      'code-span': true
    }
  }
}
CodeSpan.tagName = 'SPAN'
CodeSpan.blotName = 'code-span'

export default CodeSpan
