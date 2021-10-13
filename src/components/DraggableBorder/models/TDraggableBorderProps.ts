import TRectSides from './TRectSides';

type TDraggableBorderProps = {
    targetElement: HTMLElement | string;
    defaultValue?: number;
    side: TRectSides;
    minValue?: number;
    maxValue?: number;
    snapDistance?: number;
    smartLayout?: boolean;
    snap?: number;
}
export default TDraggableBorderProps;