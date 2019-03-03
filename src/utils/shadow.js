export default function shadow(id = 'shadow-id') {
  // Check needed for loading in webpack config
  // Node will shout at document variable at import time
  if (document == null) {
    return null;
  }

  const node = document.getElementById(id);

  // check modern browsers
  if (node.shadowRoot == null && node.attachShadow != null) {
    node.attachShadow({ mode: 'open' });
  }

  // return DOM node itself for IE
  // https://caniuse.com/#feat=shadowdomv1
  return node.shadowRoot != null ? node.shadowRoot : node;
}
