export function computeStyle(el: HTMLElement, prop: string){
    return window.getComputedStyle(el).getPropertyValue(prop);
}

export function getDisplayLevel(el: HTMLElement) {
    return computeStyle(el, 'display');
}

export function isAutoDimensions(el: HTMLElement){
    let clone = <HTMLElement>el.cloneNode(true);
    clone.style.display = 'inline-block';
    clone.style.position = 'fixed';
    document.body.appendChild(clone);
    clone.innerHTML = 'foo';
    const widthWithContent = clone.offsetWidth;
    const heightWithContent = clone.offsetHeight;
    clone.innerHTML = '';
    const widthWithoutContent = clone.offsetWidth;
    const heightWithoutContent = clone.offsetHeight;
    clone.parentNode.removeChild(clone);
    clone = null;

    return {
        isAutoWidth: widthWithContent === widthWithoutContent,
        isAutoHeight: heightWithContent === heightWithoutContent,
    };
}