import IDragTargetApi from './IDragTargetApi';
import getElement from '../utils/getElement';
import * as computeCss from '../utils/computeCss';

export default class DragTargetDomUtil {
    targetElement: HTMLElement;
    stretchElement: HTMLElement;
    api: IDragTargetApi;
    constructor(api: IDragTargetApi) {
        this.targetElement = <HTMLElement>getElement(api.targetElement);
        this.api = api;
        this.addClasses();
    }

    get horizontalClassName(){
        return `is-${this.api.side}`;
    }
    get isHorizontal (){
        return 'top bottom'.includes(this.api.side);
    }

    toggleSnappedClasses(targetElement, draggerElement, allowSnap: boolean){
        draggerElement.classList.toggle('is-snapped', allowSnap);
        targetElement.classList.toggle('is-snapped', allowSnap);
    }

    private addClasses(){
        if(!this.api.smartLayout) return;
        if(this.targetElement.classList.contains('DraggableBorder-target')) return;
        this.targetElement.classList.add('DraggableBorder-target');
        const parent = <HTMLElement>this.targetElement.parentNode;
        const children = <HTMLElement[]>Array.from(parent.children);

        this.addClassesToParent(parent);
        this.addClassToStretchElement(children);
    }

    private addClassesToParent(parent: HTMLElement){
        const displayLevel = computeCss.getDisplayLevel(parent);
        let className;
        switch (displayLevel) {
        case 'grid' : className = 'DraggableBorder-parentGrid'; break;
        default : className = 'DraggableBorder-parent';
        }
        parent.classList.add(className, this.horizontalClassName);
    }

    private addClassToStretchElement(children: HTMLElement[]){
        if(this.stretchElement) {
            this.stretchElement?.classList.add('DraggableBorder-stretch');
        } else {
            const siblings = this.getStretchSiblings(children);
            siblings.forEach((el)=>{
                el.classList.toggle('DraggableBorder-stretch', !!siblings.find(e=>e===el));
            });
        }
    }

    private getStretchSiblings(children: HTMLElement[]): HTMLElement[] {
        const siblings = [].filter.call(children, (child)=>{
            const isTarget = child.classList.contains('DraggableBorder-target');
            const isDragger = child.classList.contains('DraggableBorder');
            const autoDim = computeCss.isAutoDimensions(child);
            const isAutoDim = this.isHorizontal ? autoDim.isAutoWidth : autoDim.isAutoHeight;
            return !(isTarget || isDragger || isAutoDim);
        });
        return siblings;
    }
}