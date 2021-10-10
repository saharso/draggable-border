import React, {useEffect, useRef, useState} from 'react';
import './DraggableBorder.scss';

export function getElement(data: string){
    return document.querySelector(data) || null;
}

export interface DragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    snap?: number;
    horizontal?: boolean;
}
export class DragTargetUtil {
    static draggerCollectionX: HTMLElement[] = [];
    static targetCollectionX: HTMLElement[] = [];
    static draggerCollectionY: HTMLElement[] = [];
    static targetCollectionY: HTMLElement[] = [];
    className: string;
    handleDraggersRect(draggerElement, index){};
    setCollection(draggerElement, targetElement){};
    calculateTargetRect(e, targetElement): number {return null;};
    updateTargetElementDimensions(targetElement, formula){}
    allowSnap(targetElement, snap): boolean {return null;}
}
class DragTargetUtilY extends DragTargetUtil {
    className = 'is-vertical';

    constructor() {
        super();
    }

    handleDraggersRect(draggerElement, index) {
        draggerElement.style.top = DragTargetUtil.targetCollectionY[index].getBoundingClientRect().top - draggerElement.offsetHeight + 'px';
        draggerElement.style.left = DragTargetUtil.targetCollectionY[index].getBoundingClientRect().left + 'px';
        draggerElement.style.width = DragTargetUtil.targetCollectionY[index].offsetWidth + 'px';
    }

    setCollection(draggerElement, targetElement){
        DragTargetUtil.draggerCollectionY.push(draggerElement);
        DragTargetUtil.targetCollectionY.push(targetElement);
    }

    calculateTargetRect(e, targetElement){
        const cursorYPosition = e.clientY;
        const targetOriginalHeight = targetElement.offsetHeight;
        const targetElementTopPosition = targetElement.getBoundingClientRect().top;
        const targetElementBottomPosition = targetElement.getBoundingClientRect().bottom;

        const formula = targetOriginalHeight - (cursorYPosition - targetElementTopPosition);

        return formula;
    }

    updateTargetElementDimensions(targetElement, formula){
        targetElement.style.height = formula + 'px';
    }

    allowSnap(targetElement, snap){
        return targetElement.offsetHeight <= snap;
    }
};
class DragTargetUtilX extends DragTargetUtil {
    className = 'is-horizontal';

    constructor() {
        super();
    }

    handleDraggersRect(draggerElement, index) {
        draggerElement.style.top = DragTargetUtil.targetCollectionX[index].getBoundingClientRect().top + 'px';
        draggerElement.style.left = DragTargetUtil.targetCollectionX[index].getBoundingClientRect().right + 'px';
        draggerElement.style.height = DragTargetUtil.targetCollectionX[index].offsetHeight + 'px';
    }

    setCollection(draggerElement, targetElement){
        DragTargetUtil.draggerCollectionX.push(draggerElement);
        DragTargetUtil.targetCollectionX.push(targetElement);
    }

    calculateTargetRect(e, targetElement){
        const cursorXPosition = e.clientX;
        const targetOriginalWidth = targetElement.offsetWidth;
        const targetElementLeftPosition = targetElement.getBoundingClientRect().left;

        const formula = targetOriginalWidth - targetElementLeftPosition + (cursorXPosition - targetOriginalWidth);

        return formula;
    }

    updateTargetElementDimensions(targetElement, formula){
        requestAnimationFrame(()=>{
            targetElement.style.width = formula + 'px';
        });
    }

    allowSnap(targetElement, snap){
        return targetElement.offsetWidth <= snap;
    }
};

class DragTarget {
    formula: number;
    isMouseDown: boolean;
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    snap: number = 100;
    horizontal: boolean = true;
    isSlideForward: boolean;
    clientMovement: Set<number> = new Set();
    util: DragTargetUtil;
    static targetCollectionX: HTMLElement[] = [];

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
        this.util = this.horizontal ? new DragTargetUtilX() : new DragTargetUtilY();
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
        this.updateDraggingElementRect();
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
        this.updateDraggingElementRect();
    }

    handleMouseMove(e){
        if(!this.isMouseDown) return;
        this.clientMovement.add(this.horizontal ? e.clientX : e.clientY);
        this.updateFormula(e);
        this.updateTargetElementDimensions();
        this.updateDraggingElementRect();
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

    updateDraggingElementRect(){
        requestAnimationFrame(()=>{
            DragTargetUtil.draggerCollectionX.forEach((draggerElement, index) => {
                new DragTargetUtilX().handleDraggersRect(draggerElement, index);
            });
            DragTargetUtil.draggerCollectionY.forEach((draggerElement, index) => {
                new DragTargetUtilY().handleDraggersRect(draggerElement, index);
            });
        });
    }

    doSnap(){
        if(
            this.isSlideForward &&
            this.util.allowSnap(this.targetElement, this.snap)
        ) {
            this.formula = 0;
            this.updateTargetElementDimensions();
            this.updateDraggingElementRect();
        }
    }
}



export type DraggableBorderProps = {
    target?: string;
    horizontal: boolean;
}

export function useTargetElement(props: DraggableBorderProps, draggableBorderRef){
    const [targetElement, setTargetElement] = useState(null);
    const [draggerElement, setDraggerElement] = useState(null);
    const [targetWidth, setTargetWidth] = useState(0);

    useEffect(()=>{
        if(!draggableBorderRef) return;
        setTargetElement(getElement(props.target));
        setDraggerElement(draggableBorderRef.current);
    }, [draggableBorderRef]);

    useEffect(()=>{
        if(!targetElement) return;
    }, [targetElement]);

    useEffect(()=>{
        if(!draggerElement || !targetElement) return;
        new DragTarget({
            draggerElement,
            targetElement,
            horizontal: props.horizontal,
        });
    }, [draggerElement, targetElement]);
}


const DraggableBorder: React.FunctionComponent<DraggableBorderProps> = (props)=>{

    const draggableBorderRef = useRef(null);

    const targetElement = useTargetElement({...props}, draggableBorderRef);

    useEffect(()=>{
        const el = draggableBorderRef.current;
    }, [draggableBorderRef]);
    return <div
        ref={draggableBorderRef}
        className={'DraggableBorder'}
    />;
};

export default DraggableBorder;