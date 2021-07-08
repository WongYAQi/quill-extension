import Quill from 'quill'
import { TinyMceTheme} from './theme/tinymce'

Quill.register('themes/tinymce', TinyMceTheme)

window.onload = () => {
  const quill2 = new Quill('#editor-wrapper-snow', {
    theme: 'snow',
    modules: {
      table: false
    }
  })
  const quill = new Quill('#editor-wrapper', {
    theme: 'tinymce',
    modules: {
      table: false
    }
  })
}
