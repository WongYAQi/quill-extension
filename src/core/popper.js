const POPPERITEM_HEIGHT = 25

/**
 * Popper机制
 * stack: 存储父popper?
 * show, hide 机制
 * 定位基准，是上下定位还是左右定位
 * 离开并不会隐藏popper，而是激活其他popper时才会
 * 对所有ql-menu-[format] 做 popper 设置，通过 ref 不断向外遍历来获得 parents 关系？
 * 关系并不应该是 Popper 管理的吧？
 */
class Popper {
  /**
   * 
   * @param {HTMLElement} ref 触发 Popper 的元素 
   * @param { Array<Popper> } parents
   */
  constructor (ref, parents) {
    this.parents = parents || []
    this.align = 'bottom'
    this.container = document.createElement('div')
    this.container.classList.add('ql-tinymce')
    this.container.classList.add('ql-tinymce-popper')
    this.container.triggerElement = ref
    this.ref = ref
    this.ref.addEventListener('mouseenter', evt => {
      this.show(evt)
    })
  }
  /**
   * 显示某个 Popper 时，根据 PopperManager 的 stack 来隐藏其他的popper
   * @param {*} activePopper 就是 this
   */
  show (evt) {
    PopperManager.clearPopper(this)
    PopperManager.append(...this.parents.concat(this))
    this.ref.appendChild(this.container)
    this.container.classList.add('is-active')
    this.calculate(evt, this)
  }
  hide () {
    this.container.remove()
    this.container.classList.remove('is-active')
    this.ref.classList.remove('is-active')
  }
  /**
   * 计算定位
   * @param { MouseEvent } evt
   */
  calculate (evt) {
    /** @type { Popper } */
    let popper = this
    let target = evt.target
    if (!(target instanceof HTMLElement)) return
    let len = popper.container.querySelectorAll('div[class^=ql-menu]').length
    let height = len * POPPERITEM_HEIGHT + popper.container.children.length * 6
    let documentOffsetHeight = document.body.offsetHeight
    let rect = target.getBoundingClientRect()
    let triggerElementPositionY = rect.top
    let mins = documentOffsetHeight - triggerElementPositionY

    if (this.align === 'bottom') {
      mins -= Math.ceil(rect.height)
      popper.container.style.left = rect.left + 'px'
      popper.container.style.top = rect.top + rect.height + 'px'
    } else if (this.align === 'right') {
      popper.container.style.left = rect.left + rect.width + 'px'
      popper.container.style.top = rect.top + 'px'
    }

    if (mins < height) {
      popper.container.style.height = mins + 'px'
    } else {
      popper.container.style.height = 'initial'
    }
  }
}

/**
 * 管理激活的 Popper 
 */
const PopperManager = {
  /**
   * @type { Array<Popper> }
   */
  stack: [],
  append (...stacks) {
    this.stack.push(...stacks)
  },
  /**
   * 将 stack 存储的popper一一隐藏，直到遍历到 activePopper 的parents栈中的最后一项
   * @param {Popper} activePopper 
   */
  clearPopper (activePopper) {
    let stack = activePopper
      ? activePopper.parents.slice()
      : []
    let localStack = this.stack.slice()
    while (localStack.length) {
      let localLastStack = localStack.pop()
      // 如果 localLastStack 在 stack 中存在，则退出，不存在，则消除当前 localLastStack
      if (stack.indexOf(localLastStack) > -1) {
        break
      } else {
        localLastStack.hide()
      }
    }
  }
}

/**
 * 为非根menu创建的popper，比如 File_Export_Pdf
 * 除了 Menu意外，options, color可能也要考虑上下左右的定位规则，这样的话就不建议创建多个Popper,用属性来控制
 */
class MenuPopper extends Popper {
  /**
   * 初始化Menupopper，如果ref中含有 ql-group 的子项，说明迟早要对子项做 parents 处理
   * @param {HTMLElement} ref 
   * @param {*} parents 
   */
  constructor (ref, parents) {
    super(ref, parents)
    for(let i=0;i < [...ref.childNodes].length;i++) {
      if (ref.childNodes[i].classList.contains('ql-group')) {
        this.container.appendChild(ref.childNodes[i])
        i--
      }
    }
    // 找父级
    let parentEle = ref.parentElement
    while (parentEle) {
      if (parentEle._popper instanceof Popper) {
        this.parents.unshift(parentEle._popper)
        this.align = 'right'
      }
      parentEle = parentEle.parentElement || parentEle.triggerElement
    }
    ref._popper = this
  }
}
class ColorPopper extends Popper {

}
/**
 * Menu 和 Options 的区别在于，Menu是通过Dom生成的，而 Options是根据Plugin中存储的 options 数据来动态生成的
 */
class OptionsPopper extends Popper {

}

module.exports = {
  MenuPopper,
  PopperManager
}