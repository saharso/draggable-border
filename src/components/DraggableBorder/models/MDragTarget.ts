import DragTargetApi from './IDragTargetApi';
import DragTargetUtil from './MDragTargetUtil';

export default class MDragTarget {
    formula: number;
    isMouseDown: boolean;
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    snap: number = 100;
    horizontal: boolean = true;
    isSlideForward: boolean;
    clientMovement: Set<number> = new Set();
    util: DragTargetUtil;

    constructor(api: DragTargetApi) {
        this.updateWithApi(api);
        this.updateDraggerElement();
        this.setCollection();
        this.handleEvents();
    }

    updateWithApi(api: DragTargetApi) {
        Object.keys(api).forEach((key)=>{
            this[key] = api[key];
        });
        this.util = new DragTargetUtil(this.horizontal);
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
        if(
            this.isSlideForward &&
            this.util.allowSnap(this.targetElement, this.snap)
        ) {
            this.formula = 0;
            this.updateTargetElementDimensions();
            this.util.updateDraggingElementsRect();
        }
    }
}