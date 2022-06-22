export interface TooltipOptions {
  content?: string;
  contentAttr?: string;
}

export class TooltipCore {
  el: HTMLElement;
  options: TooltipOptions;
  tooltip: HTMLDivElement | null = null;

  private blurFunc = (e: Event) => {
    this.activeElement = null;

    this.hide(e);
  };
  private focusFunc = this.focus.bind(this);
  private hideFunc = (e: Event) => this.hide(e);
  private showFunc = this.show.bind(this);
  private showFuncPrevent = (e: Event) => {
    e.preventDefault();

    this.show();
  };
  private updateFunc = this.update.bind(this);
  private activeElement: Element | null = null;

  constructor(el: HTMLElement, options?: TooltipOptions) {
    this.el = el;
    this.options = Object.assign({
      contentAttr: 'data-title'
    }, options);

    this.init();

    if (!document.querySelector('#io-tooltip-styles')) this.addStyles();
  }

  private addStyles() {
    const style = document.createElement('style');

    style.id = 'io-tooltip-styles';
    style.innerHTML = `
      .io-tooltip {
        top: 0;
        left: 0;
        background-color: #6D6D6D;
        border-radius: 0.25em;
        color: rgba(255, 255, 255, 0.87);
        font-size: 0.8em;
        opacity: 0;
        padding: 0.5em;
        position: fixed;
        transition: opacity 0.125s ease-in-out;
      }

      .io-tooltip.active {
        opacity: 1;
      }
    `;

    document.head.appendChild(style);
  }

  destroy() {
    const title = this.el.getAttribute('data-title');

    if (this.options.contentAttr === 'data-title' && title) {
      this.el.setAttribute('title', title);
      this.el.removeAttribute('data-title');
    }

    this.el.removeEventListener('blur', this.blurFunc);
    document.removeEventListener('scroll', this.updateFunc, true);
    window.removeEventListener('orientationchange', this.updateFunc);

    if (this.isTouch()) {
      document.removeEventListener('click', this.hideFunc);

      this.el.removeEventListener('contextmenu', this.showFuncPrevent);
    } else {
      this.el.removeEventListener('focus', this.showFunc);
      this.el.removeEventListener('mouseover', this.showFunc);
      this.el.removeEventListener('mouseout', this.hideFunc);

      document.removeEventListener('keydown', this.focusFunc);
    }
  }

  private focus(e: KeyboardEvent) {
    if (e.key === 'Tab') setTimeout(() => this.activeElement = document.activeElement);
  }

  private getContent() {
    let title = this.el.getAttribute('title');

    if (this.options.contentAttr === 'data-title' && title) {
      this.el.setAttribute('data-title', title);
      this.el.removeAttribute('title');
    } else title = this.el.getAttribute(this.options.contentAttr as string);

    return title;
  }

  private getPosition() {
    const 
      elRect = this.el.getBoundingClientRect(),
      tooltipRect = (this.tooltip as HTMLDivElement).getBoundingClientRect();

    let position = {
      x: elRect.left + elRect.width / 2 - tooltipRect.width / 2,
      y: elRect.top > window.innerHeight / 2 ? elRect.top - tooltipRect.height - 8 : elRect.top + elRect.height + 8
    }

    if (position.x < 0 && elRect.left <= window.innerWidth / 2) position.x = elRect.left;

    if (position.x + tooltipRect.width > window.innerWidth) position.x = elRect.right - tooltipRect.width;

    return position;
  }

  hide(e: Event) {
    if (!this.tooltip || this.activeElement === this.el || ((e as MouseEvent).relatedTarget && this.el.contains((e as MouseEvent).relatedTarget as Node))) return;

    let tooltip: HTMLDivElement | null = this.tooltip;

    this.tooltip = null;
    
    tooltip.classList.remove('active');
    tooltip.ontransitionend = () => {
      tooltip?.remove();
      tooltip = null;
    }

    setTimeout(() => {
      if (tooltip) tooltip.remove();
    }, 125);
  }

  private init() {
    this.el.addEventListener('blur', this.blurFunc, true);
    document.addEventListener('scroll', this.updateFunc, true);
    window.addEventListener('orientationchange', this.updateFunc);

    if (this.isTouch()) {
      document.addEventListener('click', this.hideFunc);

      this.el.addEventListener('contextmenu', this.showFuncPrevent);
    } else {
      this.el.addEventListener('focus', this.showFunc);
      this.el.addEventListener('mouseover', this.showFunc);
      this.el.addEventListener('mouseout', this.hideFunc);

      document.addEventListener('keydown', this.focusFunc);
    }
  }

  private isTouch = () => 'ontouchstart' in window || (navigator as any).msMaxTouchPoints;

  show() {
    if (this.tooltip) return;

    const
      tooltip = document.createElement('div'),
      content = this.options.content ?? this.getContent() as string;

    tooltip.className = 'io-tooltip';
    tooltip.innerHTML = content;

    document.body.appendChild(tooltip);

    this.tooltip = tooltip;

    this.update(); 
  }

  update() {
    if (!this.tooltip) return; 

    const position = this.getPosition();

    this.tooltip.style.transform = `translate(${position.x}px, ${position.y}px)`;
    this.tooltip.classList.add('active');
  }
}
