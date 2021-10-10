interface DragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    snap?: number;
    horizontal?: boolean;
}

export default DragTargetApi;