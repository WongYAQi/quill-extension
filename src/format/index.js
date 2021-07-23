import CodeSpan from './codespan'
import Quill from 'quill'

Quill.register({
  'formats/codeSpan': CodeSpan
}, true)
