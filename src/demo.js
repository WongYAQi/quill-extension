import Quill from 'quill'
import { TinyMceTheme} from './theme/tinymce'

Quill.register('themes/tinymce', TinyMceTheme)

window.onload = () => {
  const quill = new Quill('#editor-wrapper', {
    theme: 'tinymce',
    modules: {
      table: false
    }
  })

}
