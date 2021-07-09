import extend from 'extend';
import Quill from 'quill'
const SnowTheme = Quill.import('themes/snow')
const icons = Quill.import('ui/icons')
const Picker = Quill.import('ui/picker')

import '../assets/tinymce.styl'

const TOOLBAR_CONFIG = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
];
const MENU_CONFIG = [

]



class TinyMceTooltip {

}

/**
 * Tinymce 相比 snow 主题，多出了什么？
 * 1. toolbar 的按钮激活样式, 直接修改样式表? 还是重写一份 Toolbar, 相对于以前的toolbar，我产生了什么新的内容？File等菜单栏
 * 2. 下拉框的样式
 * 3. tooltip 的样式
 * 4. 激活的popper，popper 中可以是表单，可以是输入矿，
 */
class TinyMceTheme extends SnowTheme {
  constructor (quill, options) {
    if (
      options.modules.toolbar != null &&
      options.modules.toolbar.container == null
    ) {
      options.modules.toolbar.container = TOOLBAR_CONFIG;
    }
    super(quill, options);
    this.quill.container.classList.remove('ql-snow');
    this.quill.container.classList.add('ql-tinymce');
  }

  extendToolbar(toolbar) {
    super.extendToolbar(toolbar)
    toolbar.container.classList.remove('ql-snow');
    toolbar.container.classList.add('ql-tinymce')
  }
}
TinyMceTheme.DEFAULTS = extend(true, {}, SnowTheme.DEFAULTS, {
  modules: {
    toolbar: {
      handlers: {
        link(value) {
          if (value) {
            const range = this.quill.getSelection();
            if (range == null || range.length === 0) return;
            let preview = this.quill.getText(range);
            if (
              /^\S+@\S+\.\S+$/.test(preview) &&
              preview.indexOf('mailto:') !== 0
            ) {
              preview = `mailto:${preview}`;
            }
            const { tooltip } = this.quill.theme;
            tooltip.edit('link', preview);
          } else {
            this.quill.format('link', false);
          }
        },
      },
    },
  },
});

function fillSelect(select, values, defaultValue = false) {
  values.forEach(value => {
    const option = document.createElement('option');
    if (value === defaultValue) {
      option.setAttribute('selected', 'selected');
    } else {
      option.setAttribute('value', value);
    }
    select.appendChild(option);
  });
}

export {
  TinyMceTheme
}