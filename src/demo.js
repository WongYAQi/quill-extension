import Quill from 'quill'
import { TinyMceTheme} from './theme/tinymce'
window.onload = () => {
  const quill2 = new Quill('#editor-wrapper-snow', {
    theme: 'snow',
    modules: {
      table: false
    }
  })

Quill.register('themes/tinymce', TinyMceTheme)
  const quill = new Quill('#editor-wrapper', {
    theme: 'tinymce',
    modules: {
      table: false
    }
  })
}
