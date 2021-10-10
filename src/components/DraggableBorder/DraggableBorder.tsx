import React, {useRef} from 'react';
import useUpdateTargetElementRect from './hooks/useUpdateTargetElementRect';
import TDraggableBorderProps from './models/TDraggableBorderProps';
import './DraggableBorder.scss';

const DraggableBorder: React.FunctionComponent<TDraggableBorderProps> = (props)=>{

    const draggableBorderRef = useRef(null);

    useUpdateTargetElementRect({...props}, draggableBorderRef);

    return <div
        ref={draggableBorderRef}
        className={'DraggableBorder'}
    />;
};

export default DraggableBorder;