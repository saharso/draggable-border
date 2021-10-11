import IDragTargetApi from './IDragTargetApi';
import DragTargetUtil from './MDragTargetUtil';
import DomUtil from './DomUtil';

export default class MDragTarget implements IDragTargetApi {
    formula: number;
    isMouseDown: boolean;
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    stretchElement: HTMLElement;
    snap: number = 100;
    horizontal: boolean = true;
    isSlideForward: boolean;
    clientMovement: Set<number> = new Set();
    util: DragTargetUtil;
    domUtil: DomUtil;

    constructor(api: IDragTargetApi) {
        this.updateWithApi(api);
        this.updateDraggerElement();
        this.setCollection();
        this.handleEvents();
    }

    updateWithApi(api: IDragTargetApi) {
        Object.keys(api).forEach((key)=>{
            this[key] = api[key];
        });
        this.util = new DragTargetUtil(this.horizontal);
        this.domUtil = new DomUtil(api);
    }

    updateDraggerElement(){
        this.draggerElement.classList.add(this.util.className);
    }

    setCollection() {
        this.util.setCollection(this.draggerElement, this.targetElement);
    }

    handleEvents(){
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        this.draggerElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.util.updateDraggingElementsRect();
    }

    handleMouseUp(e){
        this.isMouseDown = false;
        this.updateSlideDirection();
        this.doSnap();
    }

    handleMouseDown(){
        this.clientMovement.clear();
        this.isMouseDown = true;
    }

    handleResize(){
        this.util.updateDraggingElementsRect();
    }

    handleMouseMove(e){
        if(!this.isMouseDown) return;
        this.clientMovement.add(this.horizontal ? e.clientX : e.clientY);
        this.updateFormula(e);
        this.updateTargetElementDimensions();
        this.util.updateDraggingElementsRect();
    }

    updateFormula(e) {
        this.formula = this.util.calculateTargetRect(e, this.targetElement);
    }

    updateSlideDirection(){
        const vals = [...this.clientMovement.values()];
        const prev = vals.pop();
        const next = vals.pop();
        this.isSlideForward = this.horizontal ? prev < next : prev > next;
    }

    updateTargetElementDimensions(){
        this.util.updateTargetElementDimensions(this.targetElement, this.formula);
    }

    doSnap(){
        const allowSnap = this.util.allowSnap(this.targetElement, this.snap);
        const conditions = [
            this.isSlideForward,
            allowSnap,
        ].every(e=>e);

        if(conditions){
            this.formula = this.util.draggerElementDim(this.draggerElement);
            this.updateTargetElementDimensions();
            this.util.updateDraggingElementsRect();
        }
        this.domUtil.toggleSnappedClasses(this.targetElement, this.draggerElement, allowSnap);
    }
}