import Quill from 'quill'
const { StyleAttributor, Scope } = Quill.import('parchment')
const FontsizesStyle = new StyleAttributor('fontsizes', 'font-size', {
  scope: Scope.INLINE,
  whitelist: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']
})
export default FontsizesStyle
