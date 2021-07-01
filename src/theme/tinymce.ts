import Quill from 'quill'
const SnowTheme = Quill.import('core/theme')
console.log(SnowTheme)

/**
 * Tinymce 相比 snow 主题，多出了什么？
 * 1. toolbar 的按钮激活样式, 直接修改样式表? 还是重写一份 Toolbar, 相对于以前的toolbar，我产生了什么新的内容？File等菜单栏
 * 2. 下拉框的样式
 * 3. tooltip 的样式
 * 4. 激活的popper，popper 中可以是表单，可以是输入矿，
 */
class TinyMCETheme extends SnowTheme {

}

export {
  TinyMCETheme
}