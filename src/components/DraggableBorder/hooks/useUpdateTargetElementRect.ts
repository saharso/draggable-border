import React, {useEffect, useRef, useState} from 'react';
import TDraggableBorderProps from '../models/TDraggableBorderProps';
import IDragTargetApi from '../models/IDragTargetApi';
import DragTarget from '../models/DragTarget';

export function getElement(data: string){
    return document.querySelector(data) || null;
}

export default function useUpdateTargetElementRect(props: TDraggableBorderProps, draggableBorderRef){
    const [targetElement, setTargetElement] = useState(null);
    const [draggerElement, setDraggerElement] = useState(null);
    const [stretchElement, setStretchElement] = useState(null);
    const [dimensions, setDimensions] = useState(0);

    useEffect(()=>{
        if(!draggableBorderRef) return;
        setTargetElement(getElement(props.target));
        setStretchElement(getElement(props.stretch));
        setDraggerElement(draggableBorderRef.current);
    }, [draggableBorderRef]);

    useEffect(()=>{
        if(!targetElement) return;
    }, [targetElement]);

    useEffect(()=>{

        if(!(draggerElement || targetElement || stretchElement)) return;
        new DragTarget({
            ...props,
            stretchElement,
            draggerElement,
            targetElement,
            onAfterDrag: (e) => {
                setDimensions(e.dimension);
            }
        });
    }, [draggerElement, targetElement, stretchElement]);

    useEffect(()=>{
        console.log(dimensions);
    }, [dimensions]);
}
