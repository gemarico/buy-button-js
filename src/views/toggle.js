import View from '../view';

const ENTER_KEY = 13;
const SPACE_KEY = 32;

export default class ToggleView extends View {
  get shouldResizeY() {
    return true;
  }

  get shouldResizeX() {
    return true;
  }

  get isVisible() {
    return this.component.count > 0;
  }

  get stickyClass() {
    return this.component.options.sticky ? 'is-sticky' : 'is-inline';
  }

  get outerHeight() {
    return `${this.wrapper.clientHeight}px`;
  }

  get readableLabel() {
    if (this.component.options.contents.title) {
      return '';
    }
    return `<p class="shopify-buy--visually-hidden">${this.component.options.text.title}</p>`;
  }

  get accessibilityLabel() {
    return `<span>${this.component.options.text.title}</span>`;
  }

  get countAccessibilityLabel() {
    if (!this.component.options.contents.count) {
      return '';
    }
    return `<span>${this.component.options.text.countAccessibilityLabel} ${this.component.count}</span>`;
  }

  get summaryHtml() {
    return `<span class="shopify-buy--visually-hidden">${this.accessibilityLabel}${this.countAccessibilityLabel}</span>`;
  }

  render() {
    super.render();
    if (this.component.options.sticky) {
      this.addClass('is-sticky');
    }
    if (this.isVisible) {
      this.addClass('is-active');
    } else {
      this.removeClass('is-active');
    }
    if (this.iframe) {
      this.iframe.parent.setAttribute('tabindex', 0);
      this.iframe.parent.setAttribute('role', 'button');
      this.iframe.el.setAttribute('aria-hidden', true);
      this.resize();
      this.node.insertAdjacentHTML('afterbegin', this.summaryHtml);
    }
  }

  delegateEvents() {
    super.delegateEvents();
    if (!this.iframe) {
      return;
    }
    this.iframe.parent.addEventListener('keydown', (evt) => {
      if (evt.keyCode !== ENTER_KEY && evt.keyCode !== SPACE_KEY) {
        return;
      }
      evt.preventDefault();
      this.component.props.setActiveEl(this.node);
      this.component.props.cart.toggleVisibility(this.component.props.cart);
    });
  }

  wrapTemplate(html) {
    return `<div class="${this.stickyClass} ${this.component.classes.toggle.toggle}">
      ${html}
      ${this.readableLabel}
    </div>`;
  }

  _resizeX() {
    this.iframe.el.style.width = `${this.wrapper.clientWidth}px`;
  }
}
