import React, {useEffect, useRef, useState} from 'react';
import './DraggableBorder.scss';

export function getElement(data: HTMLElement | string){
    if(data instanceof Element) {return data;}
    else if (typeof data === 'string') {return document.querySelector(data) || null;}
    else return null;
}

let _targetElement;
let _formula;
let _isMouseDown: boolean;

function _updateTargetElementWidth(){
    requestAnimationFrame(()=>{
        _targetElement.style.width = _formula + 'px';
    });
}

export function handleMouseUp(e){
    _isMouseDown = false;
}
export function handleMouseDown(e){
    _isMouseDown = true;
}

export function handleDragStart(e){
    // console.log('dragstart', e);
}
export function handleMouseMove(e){
    if(!_isMouseDown) return;
    console.log('drag', e);
    const cursorXPosition = e.clientX;
    const targetOriginalWidth = _targetElement.offsetWidth;
    console.log(cursorXPosition - targetOriginalWidth);
    _formula = targetOriginalWidth + (cursorXPosition - targetOriginalWidth);
    _updateTargetElementWidth();
}
export function handleDragEnd(e){
    // console.log('dragend', e);
    _updateTargetElementWidth();
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
        const targetElWidth = targetElement.offsetWidth;
        targetElement.style.width = targetElWidth + 'px';
        _targetElement = targetElement;
        setTargetWidth(targetElWidth);

    }, [targetElement]);

    useEffect(()=>{
        if(!draggerElement) return;
        console.log(draggerElement);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
        draggerElement.addEventListener('mousedown', handleMouseDown);

    }, [draggerElement]);
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