import IOnAfterDragApi from './IOnAfterDragApi';
import TRectSides from './TRectSides';

interface IDragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    stretchElement: HTMLElement;
    side: TRectSides;
    snap?: number;
    onAfterDrag?: (e: IOnAfterDragApi) => any;
}

export default IDragTargetApi;