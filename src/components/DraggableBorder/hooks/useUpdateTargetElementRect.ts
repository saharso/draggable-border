import React, {useEffect, useRef, useState} from 'react';
import TDraggableBorderProps from '../models/TDraggableBorderProps';
import DragTargetApi from '../models/IDragTargetApi';
import MDragTarget from '../models/MDragTarget';

export function getElement(data: string){
    return document.querySelector(data) || null;
}

export default function useUpdateTargetElementRect(props: TDraggableBorderProps, draggableBorderRef){
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
        new MDragTarget({
            draggerElement,
            targetElement,
            horizontal: props.horizontal,
        });
    }, [draggerElement, targetElement]);
}
