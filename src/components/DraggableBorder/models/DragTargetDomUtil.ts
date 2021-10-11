import IDragTargetApi from './IDragTargetApi';

function computeStyle(el: HTMLElement, prop: string){
    return window.getComputedStyle(el).getPropertyValue(prop);
}
function getDisplayLevel(el: HTMLElement) {
    return computeStyle(el, 'display');
}
function getWidth(el: HTMLElement) {
    return window.getComputedStyle(el).getPropertyValue('width');
}
function isAutoDimensions(el: HTMLElement){
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
export default class DragTargetDomUtil {
    horizontal: boolean;
    targetElement: HTMLElement
    stretchElement: HTMLElement
    constructor(api: IDragTargetApi) {
        this.horizontal = api.horizontal;
        this.targetElement = api.targetElement;
        this.stretchElement = api.stretchElement;
        this.addClasses();
    }

    get horizontalClassName(){
        return this.horizontal ? 'is-horizontal' : 'is-vertical';
    }

    toggleSnappedClasses(targetElement, draggerElement, allowSnap: boolean){
        draggerElement.classList.toggle('is-snapped', allowSnap);
        targetElement.classList.toggle('is-snapped', allowSnap);
    }

    private addClasses(){
        if(this.targetElement.classList.contains('DraggableBorder-target')) return;
        this.targetElement.classList.add('DraggableBorder-target');
        this.stretchElement?.classList.add('DraggableBorder-stretch');
        const parent = <HTMLElement>this.targetElement.parentNode;
        const children = <HTMLElement[]>Array.from(parent.children);
        parent.classList.add('DraggableBorder-parent', this.horizontalClassName);
        this.addClassToSiblings(children);
    }

    private addClassToSiblings(children: HTMLElement[]){
        const siblings = this.getChildSiblings(children);
        siblings.forEach((el)=>{
            el.classList.toggle('DraggableBorder-stretch', !!siblings.find(e=>e===el));
        });
    }

    private getChildSiblings(children: HTMLElement[]): HTMLElement[] {
        const siblings = [].filter.call(children, (child)=>{
            const isTarget = child.classList.contains('DraggableBorder-target');
            const isDragger = child.classList.contains('DraggableBorder');
            const autoDim = isAutoDimensions(child);
            const isAutoDim = this.horizontal ? autoDim.isAutoWidth : autoDim.isAutoHeight;
            return !(isTarget || isDragger || isAutoDim);
        });
        return siblings;
    }
}