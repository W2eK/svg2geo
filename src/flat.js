module.exports = function flatSvg(node) {
  function reducer(obj, { name, value }) {
    obj[name] = value;
    return obj;
  }
  const result = [];
  Array.from(node.childNodes)
    .filter(child => child.getAttribute)
    .forEach(child => {
      if (child.childNodes.length) {
        result.push(...flatSvg(child));
      } else {
        const tag = child.tagName;
        result.push(Array.from(child.attributes).reduce(reducer, { tag }));
      }
    });
  return result;
};
