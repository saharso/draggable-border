import IOnAfterDragApi from './IOnAfterDragApi';

interface IDragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    stretchElement: HTMLElement;
    horizontal: boolean;
    invertSlide?: boolean;
    snap?: number;
    onAfterDrag?: (e: IOnAfterDragApi) => any;
}

export default IDragTargetApi;