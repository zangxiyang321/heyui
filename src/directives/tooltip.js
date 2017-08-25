import Tooltip from '../plugins/tooltip';
import utils from '../utils/utils';

const getContent = function (el, vnode) {
  let param = {};
  let attrs = vnode.data.attrs || {};
  if (attrs.content === '') return false;
  if (attrs.content) {
    param.content = attrs.content;
  }
  let ref = attrs['ref-el'];
  let refNode = vnode.context.$el.querySelector(`[tmpl=${ref}]`);
  if (refNode) {
    param.content = refNode;
    param.html = true;
  } else if (param.content) {
    param.content = `<div class="h-tooltip-inner-content">${param.content}</div>`;
    param.html = true;
  } else if (el.innerText) {
    param.content = `<div class="h-tooltip-inner-content">${el.innerText}</div>`;
    param.html = true;
  }
  return param
}

const init = function (el, binding, vnode) {
  let param = getContent(el, vnode);
  let attrs = vnode.data.attrs || {};
  // if (utils.isNull(param.content) || param.content === '') return false;
  param.container = document.body;
  param = utils.initParam(param, attrs, ['placement', 'theme', 'delay', 'trigger']);
  el.tooltip = new Tooltip(el, param);
}
export default {
  inserted(el, binding, vnode) {
    init(el, binding, vnode);
  },
  update(el, binding, vnode) {
    if (el.tooltip) {
      vnode.context.$nextTick(() => {
        let param = getContent(el, vnode);
        el.tooltip.updateContent(param.content);
        log(1);
      })
    } else {
      init(el, binding, vnode);
    }
  },
  unbind(el) {
    let attr = el;
    if (attr.tooltip) {
      attr.tooltip.dispose();
      delete el.tooltip;
    }
  }
}
