import Quill from 'quill'
import { css } from '../utils'
import { createPopper, clearOtherPopper } from '../utils/popper'
const Module = Quill.import('core/module')
const PluginManager = require('../core/plugin')
const CheckSVG = require('../assets/icons/check.svg')

/**
 * label中用 _ 区分多级级联，icon 显示为前方的图标，keyboard 关键字， disabled 禁用状态
  [
    ['File_Preview'],
    ['File_Setting'],
    // 上面两个表示所属同一个一级菜单 File, 但是是不同的分组, 不会单独定义一级菜单
    ['Format_Formats', 'Format_Font Size'],
    // 上面表示 Formats 和 Font Size 是所属 Format ，并且是同一组的成员
    // 二级标签定义完了，再去定义三级标签
    [ // 这里表示 Bold 和 Italic, Underline 是一组的，但是如何表示 Formats 和其他内容是一组的呢？在前方定义二级菜单
      'Format_Formats_Bold',
      'Format_Formats_Italic',
      'Format_Formats_Underline'
    ]
  ]

  最多三层

  * FIXME: 不再提供 icon 参数，icon通过 assets 中的内容引入
    FIXME: 暂时不提供 disabled 参数，disabled具有检测是否可以变化的功能
    FIXME: 有子项的不可能具有快捷键
  * 建立一个 Menu 对应的 Icon 图标，存放在 assets 中，通过 tinymce.js 中的 extendMenu 方法完成图标的绑定
    menu 和 toolbar 的区别，menu中的内容，不会因为鼠标的select change而被触发 update ，menu永远只会单向影响 content
    menu 中的 formats 会影响 content, 有的会打开一个弹窗，新增一些内容到当前 select range

    TODO: 当前阶段，只做 formats 的内容，不做弹窗的内容
 */
class TinyMceMenu extends Module {
  constructor (quill, options) {
    super(quill, options)
    this.controls = []
    // 在 Menu 的时候，创建提前于 toolbar 之前
    if (Array.isArray(this.options.container)) {
      this.options.container = generatePluginOptionsMenuConfig(this.options.container)
      let container = document.createElement('div')
      addControls(container, this.options.container)
      /** @type { HTMLElement } */
      let targetElement = quill.container
      if (targetElement.previousElementSibling.classList.contains('ql-toolbar')) {
        targetElement = targetElement.previousElementSibling
      }
      targetElement.parentNode.insertBefore(container, targetElement)
      this.container = container
    }
    if (!(this.container instanceof HTMLElement)) {
      console.error('TinyMceMenu Module 必须通过数组参数引入的方式')
    }
    console.log(this.container)
    Array.from(this.container.querySelectorAll('div[class^=ql-menu]')).forEach(dom => {
      this.attach(dom)
    })
    this.quill.on(Quill.events.EDITOR_CHANGE, (type, range) => {
      if (type === Quill.events.SELECTION_CHANGE) {
        this.update(range);
      }
    });
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, () => {
      const [range] = this.quill.selection.getRange(); // quill.getSelection triggers update
      this.update(range);
    });
  }
  /**
   * 将这里生成的菜单和PluginManager 中的内容互相绑定
   * 按顺序生成 icon, label, keyboard, check
   * 如何区分主menu菜单项，和通过options生成的菜单项
   * @param {HTMLElement } dom
   */
  attach (dom) {

    let label = document.createElement('div')
    label.classList.add('popper-item-label')
    label.innerHTML = dom.dataset.label
    dom.appendChild(label)

    let format = dom.getAttribute('class') || ''
    format = /ql-menu-(.*)\s?/.exec(format)
    if (format) format = format[1]
    if (!format) return
    let plugin = PluginManager[format]
    if (!plugin) plugin = PluginManager[dom.getAttribute('data-plugin')]
    if (!plugin) return

    // 对于icon区域，主menu菜单默认存在icon区域，options菜单区域默认不存在icon
    let icon = document.createElement('div')
    icon.classList.add('popper-item-icon')
    if (plugin._icon instanceof Object) {
      icon.innerHTML = plugin._icon[format]
    } else if (plugin._icon) {
      icon.innerHTML = plugin._icon
    }
    if (plugin._name === format) {
      dom.insertBefore(icon, dom.children[0])
    } else if (plugin._icon && plugin._icon[format]) {
      dom.insertBefore(icon, dom.children[0])
    }

    if (plugin._name === format && plugin._keyboard) {
      // metaKey, ctrlKey, shiftKey and altKey
      let [key, ...modifiers] = plugin._keyboard
      let binding = { key }
      modifiers.forEach(k => binding[k] = true)
      this.quill.keyboard.addBinding(
        binding,
        plugin
      )
      let keyDom = document.createElement('div')
      keyDom.classList.add('popper-item-keyboard')
      keyDom.innerHTML = modifiers.map(o => o[0].toUpperCase() + o.substr(1).replace('Key', '')).reduce((p, n) => {
        return p + n + '+'
      }, '') + key.toUpperCase()
      dom.appendChild(keyDom)
    }

    // 只有 具备多个值的 plugin 生成的 item 项才具有默认的 check 区域
    if ((plugin._name !== format) ||
      (typeof plugin._check === 'boolean')
    ) {
      let checkDom = document.createElement('div')
      checkDom.classList.add('popper-item-check')
      checkDom.innerHTML = CheckSVG
      dom.appendChild(checkDom)
    }

    // 为主 menu 项（对应的是通过 options生成出来的非主menu项）
    if (plugin._name === format) {
      this.controls.push([dom, plugin])

      dom.addEventListener('click', evt => {
        plugin.call(this)
        if (typeof plugin._check === 'boolean') plugin._check = !plugin._check
        this.update(null, plugin)
      })
    } else if (plugin._options) {
      dom.addEventListener('click', evt => {
        evt.stopPropagation()
        plugin.call(this, format)
        this.update(null, plugin, format)
        clearOtherPopper()
      })
    }
  }
  /**
   * 每当鼠标定位或者其他事情，导致 document 的 editor change 或者 scroll_optimize 事件时，检测更新状态，是否显示 check
   * 有一些内容并不是format，但是也具有 checkbox 
   * @param {*} range 
   * @param {*} plugin 如果存在第二个参数，说明是自定义的只有通过点击事件触发的更新，比如 Preview
   */
  update (range, plugin, value) {
    const formats = range == null ? {} : this.quill.getFormat(range)
    const fn = (plugin, dom, value) => {
      if (typeof plugin._check === 'boolean') {
      } else if (plugin._options) {
        for(let checkDom of dom.querySelectorAll('.popper-item-check')) {
          css(checkDom, { opacity: '0' })
        }
        dom = dom.querySelector('.ql-menu-' + value)
        if (!dom) return
      } else {
        return
      }
      
      let checkDom = dom.querySelector('.popper-item-check')
      if (checkDom) {
        css(checkDom, { opacity: value ? '1' : '0' })
      }
    }
    if (plugin) {
      let item = this.controls.find(o => o[1] === plugin)
      if (item) fn(plugin, item[0], plugin._check || value)
    } else {
      this.controls.forEach(([dom, plugin]) => {
        // 这里的 controls 可能有主menu，也有携带options的主menu
        fn(plugin, dom, formats[plugin._blotName])
      })
    }
  }
}
/**
 * 这里只是添加元素，并没有绑定事件、绑定图标等内容
 * 计划修改方式：在 addControls 中填充所有的元素，然后在 attach 的时候，添加点击事件来显示
 */
function addControls (container, options) {
  const mapMenu = new Map()
  options.forEach(group => {
    let groupDom = document.createElement('span')
    let target = container
    groupDom.classList.add('ql-group')
    group.forEach(menu => {
      let parents = menu.split('_')
      if (parents.length < 2) return
      let menuDom = addMenu(container, parents.shift())
      target = menuDom
      while (parents.length) {
        menuDom = addMenu(target, groupDom, parents.shift())
        if (parents.length) target = menuDom
      }
    })
    target.appendChild(groupDom)
  })
}

/**
 * 填充 container 下的主menu菜单
 * @param {HTMLElement} container 要添加菜单的DOM
 * @param {String} menu 
 */
function addMenu (container, group, menu) {
  if (!menu) {
    menu = group
    group = container
  }
  let parentPlugin = menu.startsWith('[')
    ? /\[(.*)\]/.exec(menu)[1]
    : ''
  menu = menu.replace(/\[.*\]/, '')
  let selector = `.ql-menu-${menu.replace(/\s/g, '').toLocaleLowerCase()}`
  let dom = container.querySelector(selector)
  if (!dom) {
    dom = document.createElement('div')
    dom.setAttribute('data-label', menu)
    if (parentPlugin) dom.setAttribute('data-plugin', parentPlugin)
    dom.classList.add(selector.substring(1))
    group.appendChild(dom)
  }
  return dom
}

function generatePluginOptionsMenuConfig (configs) {
  let menus = configs.slice()
  configs.forEach(groups => {
    groups.forEach(menu => {
      let name = menu.replace(/.*_/, '')
      name = name.replace(/\s/g, '').toLowerCase()
      if (PluginManager[name] && PluginManager[name]._options) {
        let newOptionConfigs = PluginManager[name]._options.map(o => `${menu}_[${name}]${o}`)
        menus.push(newOptionConfigs)
      }
    })
  })
  return menus
}

export default TinyMceMenu