export function css (dom, obj) {
  Object.keys(obj).forEach(key => {
    dom.style[key] = obj[key]
  })
}

function componentToHex(c) {
  var hex = (+c.trim()).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
  console.log(r, g, b)
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}