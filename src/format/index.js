import CodeSpan from './codespan'
import FontsizeStyle from './size'
import Quill from 'quill'

Quill.register({
  'formats/codeSpan': CodeSpan,
  'formats/fontsizes': FontsizeStyle
}, true)
