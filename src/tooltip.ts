import { TooltipCore, TooltipOptions } from './core';

export function Tooltip(el: HTMLElement, options?: TooltipOptions) {
	return new TooltipCore(el, options);
}
