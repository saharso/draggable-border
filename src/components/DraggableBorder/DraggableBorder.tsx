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

class DragTarget {
    formula: number;
    isMouseDown: boolean;
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    snap: number = 100;
    horizontal: boolean = true;
    isSlideForward: boolean;
    clientMovement: Set<number> = new Set();
    static draggerCollectionX: HTMLElement[] = [];
    static targetCollectionX: HTMLElement[] = [];
    static draggerCollectionY: HTMLElement[] = [];
    static targetCollectionY: HTMLElement[] = [];


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
    }

    updateDraggerElement(){
        this.draggerElement.classList.add(this.horizontal ? 'is-horizontal' : 'is-vertical');
    }

    setCollection() {
        if(this.horizontal) {
            DragTarget.draggerCollectionX.push(this.draggerElement);
            DragTarget.targetCollectionX.push(this.targetElement);
        } else {
            DragTarget.draggerCollectionY.push(this.draggerElement);
            DragTarget.targetCollectionY.push(this.targetElement);
        }
    }

    handleEvents(){
        window.addEventListener('mouseup', this.handleMouseUp.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        this.updateDraggingElementXPosition();
        this.draggerElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    }

    handleMouseUp(e){
        this.isMouseDown = false;
        this.updateSlideDirection(e);
        this.doSnap();
    }

    handleMouseDown(){
        this.clientMovement.clear();
        this.isMouseDown = true;
    }

    handleResize(){
        this.updateDraggingElementXPosition();
    }

    handleMouseMove(e){
        if(!this.isMouseDown) return;
        this.clientMovement.add(this.horizontal ? e.clientX : e.clientY);
        this.updateFormula(e);
        this.updateTargetElementDimensions();
        this.updateDraggingElementXPosition();
    }

    updateFormula(e) {

        if(this.horizontal) {
            const cursorXPosition = e.clientX;
            const targetOriginalWidth = this.targetElement.offsetWidth;
            const targetElementLeftPosition = this.targetElement.getBoundingClientRect().left;

            this.formula = targetOriginalWidth - targetElementLeftPosition + (cursorXPosition - targetOriginalWidth);
        } else {
            const cursorYPosition = e.clientY;
            const targetOriginalHeight = this.targetElement.offsetHeight;
            const targetElementTopPosition = this.targetElement.getBoundingClientRect().top;
            const targetElementBottomPosition = this.targetElement.getBoundingClientRect().bottom;
            const targetHeight = targetElementBottomPosition - targetElementTopPosition;
            this.formula = targetOriginalHeight - (cursorYPosition - targetElementTopPosition);
        }

    }
    updateSlideDirection(e){
        const vals = [...this.clientMovement.values()];
        const prev = vals.pop();
        const next = vals.pop();
        this.isSlideForward = this.horizontal ? prev < next : prev > next;
    }

    updateTargetElementDimensions(){
        requestAnimationFrame(()=>{
            this.horizontal ?
                this.targetElement.style.width = this.formula + 'px' :
                this.targetElement.style.height = this.formula + 'px';
        });
    }

    updateDraggingElementXPosition(){
        requestAnimationFrame(()=>{
            DragTarget.draggerCollectionX.forEach((draggerElement, index) => {
                draggerElement.style.top = DragTarget.targetCollectionX[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTarget.targetCollectionX[index].getBoundingClientRect().right + 'px';
                draggerElement.style.height = DragTarget.targetCollectionX[index].offsetHeight + 'px';
            });
            DragTarget.draggerCollectionY.forEach((draggerElement, index) => {
                draggerElement.style.top = DragTarget.targetCollectionY[index].getBoundingClientRect().top - draggerElement.offsetHeight + 'px';
                draggerElement.style.left = DragTarget.targetCollectionY[index].getBoundingClientRect().left + 'px';
                draggerElement.style.width = DragTarget.targetCollectionY[index].offsetWidth + 'px';
            });
        });
    }

    doSnap(){
        if(!this.isSlideForward) return;
        if(this.horizontal) {
            if(this.targetElement.offsetWidth <= this.snap) {
                this.formula = 0;
                this.updateTargetElementDimensions();
                this.updateDraggingElementXPosition();
            }
        } else {
            if(this.targetElement.offsetHeight <= this.snap) {
                this.formula = 0;
                this.updateTargetElementDimensions();
                this.updateDraggingElementXPosition();
            }
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