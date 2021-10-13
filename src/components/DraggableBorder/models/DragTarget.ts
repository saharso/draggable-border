import IDragTargetApi from './IDragTargetApi';
import DragTargetRectUtil from './DragTargetRectUtil';
import DragTargetDomUtil from './DragTargetDomUtil';
import IOnAfterDragApi from './IOnAfterDragApi';
import TRectSides from './TRectSides';
import getElement from '../utils/getElement';
import DragTargetEventsUtil from './DragTargetEventsUtil';

export default class DragTarget implements IDragTargetApi {
    formula: number;
    isMouseDown: boolean;
    draggerElement: HTMLElement;
    targetElement: HTMLElement | string;
    snap: number = 100;
    horizontal: boolean = true;
    isSlideForward: boolean;
    invertSlide: boolean = false;
    smartLayout: boolean = false;
    side: TRectSides;
    rectUtil: DragTargetRectUtil;
    domUtil: DragTargetDomUtil;
    eventsUtil: DragTargetEventsUtil;
    onAfterDrag;

    constructor(api: IDragTargetApi) {
        this.updateWithApi(api);
        this.setUtils(api);
        this.updateDraggerElement();
        this.handleEvents();
        this.rectUtil.updateDraggingElementsRect();
    }

    private updateWithApi(api: IDragTargetApi) {
        Object.keys(api).forEach((key)=>{
            this[key] = api[key];
        });
        this.enforceTargetElement();
    }

    private enforceTargetElement(){
        this.targetElement = <HTMLElement | string>getElement(this.targetElement);
    }

    private setUtils(api: IDragTargetApi){
        this.rectUtil = new DragTargetRectUtil(api);
        this.domUtil = new DragTargetDomUtil(api);
        this.eventsUtil = new DragTargetEventsUtil(api);
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


    private handleMouseDown(e){
        this.eventsUtil.onMouseDown(e);
    }

    private handleMouseMove(e){
        if(!this.eventsUtil.onMouseMove(e)) return;
        this.updateFormula(e);
        this.updateTargetElementDimensions();
        this.rectUtil.updateDraggingElementsRect();
    }

    private handleMouseUp(e){
        this.eventsUtil.onMouseUp(e);
        // this.doSnap();
        this.onAfterDrag && this.onAfterDrag(<IOnAfterDragApi>{
            event: e,
            el: this.targetElement,
            side: this.side,
            dimension: this.rectUtil.targetElementDim(this.targetElement),
        });
    }


    private handleResize(){
        this.rectUtil.updateDraggingElementsRect();
    }

    private updateFormula(e) {
        this.formula = this.rectUtil.calculateTargetDimension(e, this.targetElement);
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