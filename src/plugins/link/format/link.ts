import Quill from 'quill'
const QuillLink = Quill.import('formats/link')
type TinymceLink = {
  source: string,
  text: string
  title: string
  target: string
}
console.log(QuillLink.prototype.statics.create)
let oldCreate = QuillLink.prototype.statics.create
QuillLink.create = function (value: TinymceLink) {
  const node = oldCreate.call(this, value.source);
  node.setAttribute('href', this.sanitize(value.source));
  node.setAttribute('rel', 'noopener noreferrer');
  node.setAttribute('target', value.target);
  node.setAttribute('title', value.title)
  node.classList.add('nonEditable')
  node.setAttribute('contenteditable', 'false')
  node.innerHTML = value.text
  return node;
}

let oldFormat = Quill.prototype.format
QuillLink.prototype.format = function (name: string, value: TinymceLink) {
  if (name !== this.statics.blotName || !value) {
    oldFormat(name, value);
  } else {
    this.domNode.setAttribute('href', (this.constructor as any).sanitize(value));
  }
}
