const POPPERITEM_HEIGHT = 25
/**
 * TODO: 创建 Popper 的时候，在外层按照层级顺序递归
 * 维护一个 stack, 检测 acitvePopper 的 menuid 是否已经存在，不存在则清除到同级，存在则没有变化
 * @param {HTMLElement} dom 
 */
export function createPopper (dom) {
  let popper = document.createElement('div')
  ;[...dom.children].forEach(child => popper.appendChild(child))
  let isRootMenu = dom.parentElement.classList.contains('ql-menu')
  popper.classList.add('ql-tinymce-popper')
  popper.classList.add('ql-tinymce')
  if (isRootMenu) popper.classList.add('is-root')
  dom.addEventListener('mouseenter', evt => {
    popper.classList.add('is-active')
    clearOtherPopper(popper)
    document.body.appendChild(popper)
    calculatePosition(evt, popper, isRootMenu)
  })
}

/**
 * 
 * @param {HTMLElement} activePopper 
 */
function clearOtherPopper (activePopper) {
  let isRootPopper = activePopper.classList.contains('is-root')
  for(let dom of document.querySelectorAll('.ql-tinymce-popper')) {
    if (isRootPopper && (dom)) {
      dom.remove()
    } else if (!isRootPopper && !dom.classList.contains('is-root')) {
      dom.remove()
    }
  }
}

/**
 * 
 * @param {MouseEvent} evt 
 * @param {HTMLElement} popper 
 */
function calculatePosition (evt, popper, isRootMenu) {
  let target = evt.target
  if (!(target instanceof HTMLElement)) return
  let len = popper.childNodes.length
  let height = len * POPPERITEM_HEIGHT
  let documentOffsetHeight = document.body.offsetHeight
  let rect = target.getBoundingClientRect()
  let triggerElementPositionY = rect.top
  let mins = documentOffsetHeight - triggerElementPositionY
  if (isRootMenu) {
    mins -= Math.ceil(rect.height)
    popper.style.left = rect.left + 'px'
    popper.style.top = rect.top + rect.height + 'px'
  } else {
    popper.style.left = rect.left + rect.width + 'px'
    popper.style.top = rect.top + 'px'
  }
  if (mins < height) {
    popper.style.height = mins + 'px'
  } else {
    popper.style.height = 'initial'
  }
}