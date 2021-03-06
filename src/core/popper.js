const POPPERITEM_HEIGHT = 25
const CheckSVG = require('../assets/icons/check.svg')
const { appendPopperDom, clearOtherPopper } = require('../utils/popper')
const { css } = require('../utils')
const ArrowRightSVG = require('../assets/icons/arrow-right.svg')

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
   * @param { 'click' | 'hover' } triggerEvent
   * @param { Boolean } apendToBody
   */
  constructor (ref, parents, triggerEvent = 'hover', appendToBody = false) {
    this.parents = parents || []
    this.appendToBody = appendToBody
    this.align = 'bottom'
    this.container = document.createElement('div')
    this.container.classList.add('ql-tinymce')
    this.container.classList.add('ql-tinymce-popper')
    this.container.triggerElement = ref
    this.ref = ref
    this.ref.addEventListener(triggerEvent === 'hover' ? 'mouseenter' : 'click', evt => {
      evt.stopPropagation()
      evt.preventDefault()
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
    if (this.appendToBody) {
      document.body.appendChild(this.container)
    } else {
      this.ref.appendChild(this.container)
    }
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
    let localStack = this.stack
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

/**
 * 颜色类型的Popper
 */
class ColorPopper extends Popper {
  constructor (ref, plugin, menu) {
    super(ref, [])

    appendPopperDom(ref, ['popper-item-more'], ArrowRightSVG)
    let colors = plugin._colors
    colors.forEach(group => {
      let div = document.createElement('div')
      div.classList.add('ql-color-group')
      group.forEach(color => {
        let dom = document.createElement('span')
        dom.classList.add('ql-color-item')
        css(dom, { backgroundColor: color })
        div.appendChild(dom)
      })
      this.container.appendChild(div)
    })

    this.container.addEventListener('click', evt => {
      plugin.call(menu, evt)
      PopperManager.clearPopper()
    })

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
/**
 * Menu 和 Options 的区别在于，Menu是通过Dom生成的，而 Options是根据Plugin中存储的 options 数据来动态生成的
 */
class OptionsPopper extends Popper {
  constructor (ref, plugin) {
    super(ref, [])
    appendPopperDom(ref, ['popper-item-more'], ArrowRightSVG)
    plugin._options.forEach(opt => {
      let dom = document.createElement('div')
      if (plugin._icon && plugin._icon[opt]) {
        appendPopperDom(dom, ['popper-item-icon'], plugin._icon[opt])
      }
      dom.classList.add('ql-menu')
      dom.setAttribute('qlvalue', opt)
      appendPopperDom(dom, ['popper-item-label'], opt)
      appendPopperDom(dom, ['popper-item-check'], CheckSVG)
      for(let node of dom.children) {
        css(node, {
          pointerEvents: 'none'
        })
      }
      this.container.appendChild(dom)
    })

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

/**
 * 在表单中用到的 select 下拉框涉及的 option 弹框
 * 设计的 Popper 固定了 mouseenter, 和 ref.appendChild 行为
 */
class SelectPopper extends Popper {
  constructor (ref, options) {
    super(ref, [], 'click', true)
    // 为 this.container 添加各种元素，形成options下拉框
    let opts = options.map(o => {
      return this.makeItem(o)
    })
    let panel = new SelectPanel(opts)
    this.container.appendChild(panel.dom)
    this.align = 'bottom'
  }
  makeItem (option) {
    let dom = document.createElement('div')
    dom.classList.add('ql-tinymce-listbox-item')
    dom.innerText = option.label
    dom.setAttribute('data-value', option.value)
    return dom
  }
  show (evt) {
    let rect = this.ref.getBoundingClientRect()
    css(this.container, {
      width: rect.width + 'px'
    })
    super.show(evt)
  }
}

/**
 * 一个存在高度限制的 panel 面板
 */
class SelectPanel {
  constructor (slots) {
    this.dom = this.makeContainer()
    slots.forEach(slot => {
      this.dom.appendChild(slot)
    })
  }
  makeContainer () {
    let dom = document.createElement('div')
    dom.classList.add('ql-tinymce-listbox-panel')
    return dom
  }
}
module.exports = {
  MenuPopper,
  ColorPopper,
  OptionsPopper,
  PopperManager,
  SelectPopper
}