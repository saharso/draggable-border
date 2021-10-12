import React, {useEffect, useRef, useState} from 'react';
import TDraggableBorderProps from '../models/TDraggableBorderProps';
import IDragTargetApi from '../models/IDragTargetApi';
import DragTarget from '../models/DragTarget';

export function getElement(data: string){
    return document.querySelector(data) || null;
}

export default function useUpdateTargetElementRect(props: TDraggableBorderProps, draggableBorderRef){
    const [draggerElement, setDraggerElement] = useState(null);
    const [dimensions, setDimensions] = useState(0);

    useEffect(()=>{
        setDraggerElement(draggableBorderRef.current);
    }, [draggerElement]);

    useEffect(()=>{

        if(!(draggerElement)) return;

        new DragTarget({
            ...props,
            draggerElement,
            onAfterDrag: (e) => {
                setDimensions(e.dimension);
            }
        });

    }, [draggerElement]);

}
