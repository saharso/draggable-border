import IDragTargetApi from './IDragTargetApi';
import DragTargetRectUtil from './DragTargetRectUtil';
import DragTargetDomUtil from './DragTargetDomUtil';
import IOnAfterDragApi from './IOnAfterDragApi';

export default class DragTarget implements IDragTargetApi {
    formula: number;
    isMouseDown: boolean;
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    stretchElement: HTMLElement;
    snap: number = 100;
    horizontal: boolean = true;
    isSlideForward: boolean;
    invertSlide: boolean = false;
    clientMovement: Set<number> = new Set();
    rectUtil: DragTargetRectUtil;
    domUtil: DragTargetDomUtil;
    onAfterDrag;

    constructor(api: IDragTargetApi) {
        this.updateWithApi(api);
        console.log(this);
        this.updateDraggerElement();
        this.handleEvents();
        this.rectUtil.updateDraggingElementsRect();
    }

    private updateWithApi(api: IDragTargetApi) {
        Object.keys(api).forEach((key)=>{
            this[key] = api[key];
        });
        this.rectUtil = new DragTargetRectUtil(api);
        this.domUtil = new DragTargetDomUtil(api);
    }

    private updateDraggerElement(){
        this.draggerElement.classList.add(this.rectUtil.className);
    }

    private handleEvents(){
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        this.draggerElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    }

    private handleMouseUp(e){
        e.preventDefault();
        this.isMouseDown = false;
        this.updateSlideDirection();
        this.doSnap();
        this.onAfterDrag && this.onAfterDrag(<IOnAfterDragApi>{
            event: e,
            el: this.targetElement,
            horizontal: this.horizontal,
            dimension: this.rectUtil.targetElementDim(this.targetElement),
        });
    }

    private handleMouseDown(e){
        e.preventDefault();
        this.clientMovement.clear();
        this.isMouseDown = true;
    }

    private handleResize(){
        this.rectUtil.updateDraggingElementsRect();
    }

    private handleMouseMove(e){
        if(!this.isMouseDown) return;
        e.preventDefault();
        this.clientMovement.add(this.horizontal ? e.clientX : e.clientY);
        this.updateFormula(e);
        this.updateTargetElementDimensions();
        this.rectUtil.updateDraggingElementsRect();
    }

    private updateFormula(e) {
        this.formula = this.rectUtil.calculateTargetRect(e, this.targetElement);
    }

    private updateSlideDirection(){
        const vals = [...this.clientMovement.values()];
        const prev = vals.pop();
        const next = vals.pop();
        this.isSlideForward = this.horizontal ? prev < next : prev > next;
    }

    private updateTargetElementDimensions(){
        this.rectUtil.updateTargetElementDimensions(this.targetElement, this.formula);
    }

    private doSnap(){
        const allowSnap = this.rectUtil.allowSnap(this.targetElement, this.snap);
        const conditions = [
            this.isSlideForward,
            allowSnap,
        ].every(e=>e);

        if(conditions){
            this.formula = this.rectUtil.draggerElementDim(this.draggerElement);
            this.updateTargetElementDimensions();
            this.rectUtil.updateDraggingElementsRect();
        }
        this.domUtil.toggleSnappedClasses(this.targetElement, this.draggerElement, allowSnap);
    }

}