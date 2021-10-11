interface IOnDragApi {
    dimension: number;
    el: HTMLElement;
    event: MouseEvent;
    horizontal: boolean;
}

interface IDragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    stretchElement: HTMLElement;
    snap?: number;
    horizontal?: boolean;
    onAfterDrag?: (e: IOnDragApi) => any;
}

export default IDragTargetApi;