import Quill from 'quill'
import Delta from 'quill-delta'
/**
 * clear all content
 * @param {*} range 
 * @param {*} context 
 */
function handleNewDocument (quill) {
  let delta = new Delta()
    .delete(quill.scroll.length() - 1)
  quill.updateContents(delta, Quill.sources.USER)
  quill.focus()
}

/**
 * 如何将自定义事件和原生事件连接起来？
 * 原生事件需要 range 和 context 
 * 如何保证 click 后 selection 没有被清除
 * @param {*} quill 
 */
function handleBold (quill) {
  console.log(quill.getSelection(true))

}

export default {
  newdocument: handleNewDocument,
  bold: handleBold
}
