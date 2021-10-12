import TRectSides from './TRectSides';

type TDraggableBorderProps = {
    target: string;
    stretch?: string;
    defaultWidth?: string | number;
    side: TRectSides;
}
export default TDraggableBorderProps;