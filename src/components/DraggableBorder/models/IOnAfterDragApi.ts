import TRectSides from './TRectSides';

interface IOnAfterDragApi {
    dimension: number;
    el: HTMLElement;
    event: MouseEvent;
    side: TRectSides;
}
export default IOnAfterDragApi;