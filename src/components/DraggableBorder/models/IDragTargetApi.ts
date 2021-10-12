import IOnAfterDragApi from './IOnAfterDragApi';
import TDraggableBorderProps from './TDraggableBorderProps';

interface IDragTargetApi extends TDraggableBorderProps {
    draggerElement: HTMLElement;
    onAfterDrag?: (e: IOnAfterDragApi) => any;
}

export default IDragTargetApi;