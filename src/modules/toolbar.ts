import Quill from 'quill'
const Module = Quill.import('core/module')

/**
 * 1. File 等菜单栏，菜单栏中不仅是下拉框，更是级联的下拉框
 * 2. 新的激活样式, 新的间隔样式
 */
class TinyMCEToolbar extends Module {
  quill: Quill
  constructor (quill: Quill, options) {
    super(quill, options)
    if (Array.isArray(this.options.menus)) {
      let container = document.createElement('div')
      addMenu(container, this.options.menus)
    }
    if (Array.isArray(this.options.container)) {
      let container = document.createElement('div')
      addControls(container, this.options.container)
    } else if (typeof this.options.container === 'string') {

    } else {

    }
    if (!(this.container instanceof HTMLElement)) {
      // error
    }
    this.handlers = {}
    this.controls = []

    Object.keys(this.options.handlers).forEach(key => {
      this.bind(key, this.options.handlers[key])
    })

    // 注册监听激活事件
  }
  bind (key, handler) {
    this.handlers[key] = handler
  }
  attach () {

  }
  update () {

  }
}
TinyMCEToolbar.DEFAULT = {
  container: null,
  menus: [
    { label: 'File_New Document', icon: '', disabled: false },
    { label: 'Edit_Undo', icon: '', disabled: false, keyboard: ['ctrl', 'z'] },
    { label: 'Edit_Cut', icon: '', disabled: false, keyboard: ['ctrl', 'x'] },
    { label: 'Format_Formats_Inline_Bold', disabled: false, format: '' }
  ],
  handlers: {

  }
}

/**
 *  options.container is like [
      [{ header: ['1', '2', '3', false] }],
      ['bold', 'italic', 'underline', 'link'],
      [{ list: 'ordered' }, { list2: 'bullet' }, { list: 'asd' }],
      ['clean'],
    ];
    // TODO: 如何加入多级的内容, 这种结构不支持菜单, label + icon + 快捷键 + 禁用 + 级联控制
    // TODO: 如何防止 Menu 和 Toolbar 重名
 * @param container 
 * @param groups 
 */
function addControls (container: HTMLElement, groups) {
  if (!Array.isArray(groups[0])) {
    groups = [groups]
  }
  groups.forEach(controls => {
    const group = document.createElement('span');
    group.classList.add('ql-formats');
    controls.forEach(control => {
      if (typeof control === 'string') {
        addButton(group, control)
      } else {
        let key = Object.keys(control)[0]
        let value = control[key]
        addSelect(group, key, value)
      }
    })
    addGap(group)
  })
}
function addButton (container: HTMLElement, key: string) {
  let button = document.createElement('button')
  button.classList.add(`ql-${key}`)
  container.appendChild(button)
}

// 检测是否已经存在 select，存在则添加 options 的 value
function addSelect (container: HTMLElement, key: string, value: string ) {
  let button = document.createElement('button')
  button.classList.add(`ql-${key}`)
  button.addEventListener('click', function () {
    // new select popper
  })
  container.appendChild(button)
}

type Menu = {
  [propName: string]: { label: string, icon?: string, disabled?: false, children?: Menu[], keyboard ?: string} 
}
/**
 *  label中用 _ 区分多级级联，icon 显示为前方的图标，keyboard 关键字， disabled 禁用状态
    { label: 'File_New Document', icon: '', disabled: false },
    { label: 'Edit_Undo', icon: '', disabled: false, keyboard: ['ctrl', 'z'] },
    { label: 'Edit_Cut', icon: '', disabled: false, keyboard: ['ctrl', 'x'] },
    { label: 'Format_Formats_Inline_Bold' }
 * @param container 
 * @param menus 
 */
function addMenu (container: HTMLElement, menus) {
  if (!Array.isArray(menus)) {
    throw new Error('菜单栏 options.menus 必须引入对象数组')
  }
  let innerMenus: Menu = {}
  menus.forEach(menu => {
    let names = menu.label.split('_') as string[]
    let title = names.pop()
    let tempMenu = innerMenus
    names.forEach(name => {
      if (!tempMenu[name]) {
        tempMenu[name] = { label: name, children: [], icon: '', disabled: false }
      }
      tempMenu = tempMenu[name]
    })
    tempMenu.children
  })
}
function addGap (container: HTMLElement) {
  let gap = document.createElement('div')
  gap.classList.add('ql-tinymce-gap')
  container.appendChild(gap)
}
