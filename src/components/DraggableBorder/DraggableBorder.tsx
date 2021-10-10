import React, {useEffect, useRef, useState} from 'react';
import './DraggableBorder.scss';

export function getElement(data: HTMLElement | string){
    if(data instanceof Element) {return data;}
    else if (typeof data === 'string') {return document.querySelector(data) || null;}
    else return null;
}

export interface DragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    snap?: number;
}

class DragTarget {
    formula: number;
    isMouseDown: boolean;
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    snap: number = 100;
    isSlidingLeft: boolean;
    clientX: Set<number> = new Set();
    static draggerCollection: HTMLElement[] = [];
    static targetCollection: HTMLElement[] = [];

    constructor(api: DragTargetApi) {
        this.updateWithApi(api);
        this.setCollection();
        this.handleEvents();
    }

    updateWithApi(api: DragTargetApi) {
        Object.keys(api).forEach((key)=>{
            this[key] = api[key];
        });
    }

    setCollection() {
        DragTarget.draggerCollection.push(this.draggerElement);
        DragTarget.targetCollection.push(this.targetElement);
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
        this.clientX.clear();
        this.isMouseDown = true;
    }

    handleResize(){
        this.updateDraggingElementXPosition();
    }

    handleMouseMove(e){
        if(!this.isMouseDown) return;
        this.clientX.add(e.clientX);
        this.updateFormula(e);
        this.updateTargetElementWidth();
        this.updateDraggingElementXPosition();
    }

    updateFormula(e) {
        const cursorXPosition = e.clientX;
        const targetOriginalWidth = this.targetElement.offsetWidth;
        const targetElementLeftPosition = this.targetElement.getBoundingClientRect().left;

        this.formula = targetOriginalWidth - targetElementLeftPosition + (cursorXPosition - targetOriginalWidth);

    }
    updateSlideDirection(e){
        const vals = [...this.clientX.values()];
        const prev = vals.pop();
        const next = vals.pop();
        this.isSlidingLeft = prev < next;
    }

    updateTargetElementWidth(){
        requestAnimationFrame(()=>{
            this.targetElement.style.width = this.formula + 'px';
        });
    }

    updateDraggingElementXPosition(){
        requestAnimationFrame(()=>{
            DragTarget.draggerCollection.forEach((draggerElement, index)=>{
                draggerElement.style.left = DragTarget.targetCollection[index].getBoundingClientRect().right + 'px';
            });
        });
    }

    doSnap(){
        if(!this.isSlidingLeft) return;
        if(this.targetElement.offsetWidth <= this.snap) {
            this.formula = 0;
            this.updateTargetElementWidth();
            this.updateDraggingElementXPosition();
        }
    }
}





export function useTargetElement(target: HTMLElement | string, draggableBorderRef){
    const [targetElement, setTargetElement] = useState(null);
    const [draggerElement, setDraggerElement] = useState(null);
    const [targetWidth, setTargetWidth] = useState(0);

    useEffect(()=>{
        if(!draggableBorderRef) return;
        setTargetElement(getElement(target));
        setDraggerElement(draggableBorderRef.current);
    }, [draggableBorderRef]);

    useEffect(()=>{
        if(!targetElement) return;
    }, [targetElement]);

    useEffect(()=>{
        if(!draggerElement || !targetElement) return;
        new DragTarget({draggerElement, targetElement});
    }, [draggerElement, targetElement]);
}

export type DraggableBorderProps = {
    target?: HTMLElement | string;
    direction: 'left-right' | 'up-down””';
}
const DraggableBorder: React.FunctionComponent<DraggableBorderProps> = (props)=>{

    const draggableBorderRef = useRef(null);

    const targetElement = useTargetElement(props.target, draggableBorderRef);

    useEffect(()=>{
        const el = draggableBorderRef.current;
    }, [draggableBorderRef]);
    return <div
        ref={draggableBorderRef}
        className={'DraggableBorder'}
    />;
};

export default DraggableBorder;