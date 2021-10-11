import IOnAfterDragApi from './IOnAfterDragApi';

interface IDragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    stretchElement: HTMLElement;
    snap?: number;
    horizontal?: boolean;
    onAfterDrag?: (e: IOnAfterDragApi) => any;
}

export default IDragTargetApi;