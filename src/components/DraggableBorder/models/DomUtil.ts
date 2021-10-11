import IDragTargetApi from './IDragTargetApi';

export default class DomUtil {
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
        this.stretchElement.classList.add('DraggableBorder-stretch');
        const parent = <HTMLElement>this.targetElement.parentNode;
        const children = <HTMLElement[]>Array.from(parent.children);
        parent.classList.add('DraggableBorder-parent', this.horizontalClassName);
        this.addClassToSiblings(children);
    }

    private addClassToSiblings(children: HTMLElement[]){
        const siblings = this.getChildSiblings(children);
        console.log(siblings);
        siblings.forEach((el)=>{
            el.classList.toggle('DraggableBorder-sibling', !!siblings.find(e=>e===el));
        });
    }

    private getChildSiblings(children: HTMLElement[]): HTMLElement[] {
        const siblings = [].filter.call(children, (child)=>{
            const isTarget = child.classList.contains('DraggableBorder-target');
            const isDragger = child.classList.contains('DraggableBorder');
            return !(isTarget || isDragger);
        });
        return siblings;
    }
}