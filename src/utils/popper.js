const POPPERITEM_HEIGHT = 25
const POPPER_STACK = []
/**
 * TODO: 创建 Popper 的时候，在外层按照层级顺序递归
 * 维护一个 stack, 检测 acitvePopper 的 menuid 是否已经存在，不存在则清除到同级，存在则没有变化
 * @param {HTMLElement} dom 
 */
export function createPopper (dom, parents) {
  let popper = document.createElement('div')

  let format = dom.getAttribute('class') || ''
  format = /ql-menu-(.*)\s?/.exec(format)
  if (format) format = format[1]
  else return

  if (!(parents instanceof Array)) {
    parents = [format]
  } else {
    parents.push(format)
  }

  // 在添加之前递归
  for (let child of dom.querySelectorAll(`.ql-menu-${format} > .ql-group > div[class^=ql-menu-]`)) {
    createPopper(child, parents.slice())
  }

  popper.stack = parents.slice()

  ;[...dom.children].forEach(child => {
    if (child.getAttribute('class').includes('ql-group')) {
      popper.appendChild(child)
    }
  })
  let isRootMenu = dom.parentElement.classList.contains('ql-menu')
  popper.classList.add('ql-tinymce-popper')
  popper.classList.add('ql-tinymce')
  dom.addEventListener('mouseenter', evt => {
    clearOtherPopper(popper)
    if (popper.children.length) {
      activePopper(dom, popper)
      calculatePosition(evt, popper, isRootMenu)
    }
  })
}

/**
 * 
 * @param {HTMLElement} activePopper 
 */
export function clearOtherPopper (activePopper) {
  let stack = activePopper
    ? activePopper.stack
    : []
  for (let i=POPPER_STACK.length - 1;i > -1;i--) {
    let popper = POPPER_STACK[i]
    if (!stack.join(',').includes(popper.stack.join(','))) {
      popper.remove()
      popper._bindTriggerElm.classList.remove('is-active')
      POPPER_STACK.splice(i, 1)
    }
  }
}
function activePopper (dom, activePopper) {
  dom.classList.add('is-active')
  activePopper.classList.add('is-active')
  activePopper._bindTriggerElm = dom
  POPPER_STACK.push(activePopper)
  dom.appendChild(activePopper)
}

/**
 * 
 * @param {MouseEvent} evt 
 * @param {HTMLElement} popper 
 */
function calculatePosition (evt, popper, isRootMenu) {
  let target = evt.target
  if (!(target instanceof HTMLElement)) return
  let len = popper.querySelectorAll('div[class^=ql-menu]').length
  let height = len * POPPERITEM_HEIGHT + popper.children.length * 6
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