interface IDragTargetApi {
    targetElement: HTMLElement;
    draggerElement: HTMLElement;
    stretchElement: HTMLElement;
    snap?: number;
    horizontal?: boolean;
}

export default IDragTargetApi;