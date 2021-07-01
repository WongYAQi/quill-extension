import Quill from 'quill'
import { TinyMCETheme} from './theme/tinymce'

console.log(TinyMCETheme)
window.onload = () => {
  const quill = new Quill('#editor-wrapper', {
    theme: 'snow',
    modules: {
      table: false
    }
  })

}
