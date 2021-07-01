import Quill from 'quill'
import { EmbedBlot, Scope } from 'parchment';

const Module = Quill.import('core/module')

/**
 * 1. File 等菜单栏，菜单栏中不仅是下拉框，更是级联的下拉框
 * 2. 新的激活样式, 新的间隔样式
 */
class TinyMCEToolbar extends Module {
  constructor (quill, options) {
    super(quill, options)
    let container = document.createElement('div')
    if (Array.isArray(this.options.menus)) {
      addMenu(container, this.options.menus)
    }
    if (Array.isArray(this.options.container)) {
      addControls(container, this.options.container)
      quill.container.parentNode.insertBefore(container, quill.container);
      this.container = container;
    } else if (typeof this.options.container === 'string') {
      this.container = document.querySelector(this.options.container);
    } else {
      this.container = this.options.container;
    }
    this.container = container
    this.container.classList.add('ql-toolbar');
    if (!(this.container instanceof HTMLElement)) {
      // error
    }
    this.handlers = {}
    this.controls = []
    Object.keys(this.options.handlers).forEach(format => {
      this.addHandler(format, this.options.handlers[format]);
    });
    Array.from(this.container.querySelectorAll('button')).forEach(
      input => {
        this.attach(input);
      },
    );
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
  addHandler(format, handler) {
    this.handlers[format] = handler;
  }

  attach(input) {
    let format = Array.from(input.classList).find((className) => {
      return className.indexOf('ql-') === 0;
    });
    if (!format) return;
    format = format.slice('ql-'.length);
    if (input.tagName === 'BUTTON') {
      input.setAttribute('type', 'button');
    }
    if (
      this.handlers[format] == null &&
      this.quill.scroll.query(format) == null
    ) {
      return;
    }
    const eventName = input.tagName === 'SELECT' ? 'change' : 'click';
    input.addEventListener(eventName, e => {
      let value;
      if (input.tagName === 'SELECT') {
        if (input.selectedIndex < 0) return;
        const selected = input.options[input.selectedIndex];
        if (selected.hasAttribute('selected')) {
          value = false;
        } else {
          value = selected.value || false;
        }
      } else {
        if (input.classList.contains('ql-active')) {
          value = false;
        } else {
          value = input.value || !input.hasAttribute('value');
        }
        e.preventDefault();
      }
      this.quill.focus();
      const [range] = this.quill.selection.getRange();
      if (this.handlers[format] != null) {
        this.handlers[format].call(this, value);
      } else if (
        this.quill.scroll.query(format).prototype instanceof EmbedBlot
      ) {
        value = prompt(`Enter ${format}`); // eslint-disable-line no-alert
        if (!value) return;
        this.quill.updateContents(
          new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert({ [format]: value }),
          Quill.sources.USER,
        );
      } else {
        this.quill.format(format, value, Quill.sources.USER);
      }
      this.update(range);
    });
    this.controls.push([format, input]);
  }

  update(range) {
    const formats = range == null ? {} : this.quill.getFormat(range);
    this.controls.forEach(pair => {
      const [format, input] = pair;
      if (input.tagName === 'SELECT') {
        let option;
        if (range == null) {
          option = null;
        } else if (formats[format] == null) {
          option = input.querySelector('option[selected]');
        } else if (!Array.isArray(formats[format])) {
          let value = formats[format];
          if (typeof value === 'string') {
            value = value.replace(/"/g, '\\"');
          }
          option = input.querySelector(`option[value="${value}"]`);
        }
        if (option == null) {
          input.value = ''; // TODO make configurable?
          input.selectedIndex = -1;
        } else {
          option.selected = true;
        }
      } else if (range == null) {
        input.classList.remove('ql-active');
      } else if (input.hasAttribute('value')) {
        // both being null should match (default values)
        // '1' should match with 1 (headers)
        const isActive =
          formats[format] === input.getAttribute('value') ||
          (formats[format] != null &&
            formats[format].toString() === input.getAttribute('value')) ||
          (formats[format] == null && !input.getAttribute('value'));
        input.classList.toggle('ql-active', isActive);
      } else {
        input.classList.toggle('ql-active', formats[format] != null);
      }
    });
  }
}
TinyMCEToolbar.DEFAULT = {
  container: null,
  menus: [
    [{ label: 'File_New Document', icon: '', disabled: false }],
    [
      { label: 'Edit_Undo', icon: '', disabled: false, keyboard: ['ctrl', 'z'] },
      { label: 'Edit_Cut', icon: '', disabled: false, keyboard: ['ctrl', 'x'] }
    ],
    [{ label: 'Format_Formats_Inline_Bold', disabled: false, format: '' }]
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
function addControls (container, groups) {
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
    container.appendChild(group)
  })
}
function addButton (container, key) {
  let button = document.createElement('button')
  button.classList.add(`ql-${key}`)
  container.appendChild(button)
}

// 检测是否已经存在 select，存在则添加 options 的 value
function addSelect (container, key, value ) {
  let button = document.createElement('button')
  button.classList.add(`ql-${key}`)
  button.addEventListener('click', function () {
    // new select popper
  })
  container.appendChild(button)
}
/**
 *  label中用 _ 区分多级级联，icon 显示为前方的图标，keyboard 关键字， disabled 禁用状态
    [{ label: 'File_New Document', icon: '', disabled: false }]
    [
      { label: 'Edit_Undo', icon: '', disabled: false, keyboard: ['ctrl', 'z'] },
      { label: 'Edit_Cut', icon: '', disabled: false, keyboard: ['ctrl', 'x'] }
    ]
    [{ label: 'Format_Formats_Inline_Bold' }]
 * @param container 
 * @param menus 
 */
function addMenu (container, menus) {
  if (!Array.isArray(menus)) {
    throw new Error('菜单栏 options.menus 必须引入对象数组')
  }
  let innerMenus = {}
  menus.forEach(groups => {
    groups.forEach(menu => {
      let names = menu.label.split('_')
      let title = names.pop()
      let group = names.shift()
      let tempMenu = innerMenus[group]
      if (!tempMenu) innerMenus[group] = { label: group, children: [], icon: '', disabled: false }
      tempMenu = innerMenus[group]
      names.forEach(name => {
        if (!tempMenu.children.find(o => o.label === name)) {
          tempMenu.children.push({ label: name, children: [], icon: '', disabled: false })
        }
        tempMenu = tempMenu.children.find(o => o.label === name)
      })
      tempMenu.children.push({ ...menu, label: title })
    })
  })
  let div = document.createElement('div')
  Object.keys(innerMenus).forEach(key => {
    let button = document.createElement('button')
    button.classList.add(`ql-${key}`)
    div.appendChild(button)
  })
  container.appendChild(div)
}
export default TinyMCEToolbar