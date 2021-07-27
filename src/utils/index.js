export function css (dom, obj) {
  Object.keys(obj).forEach(key => {
    dom.style[key] = obj[key]
  })
}