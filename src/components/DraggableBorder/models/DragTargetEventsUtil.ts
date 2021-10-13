import IDragTargetApi from './IDragTargetApi';

type TClientMovement = Set<number>;
export default class DragTargetEventsUtil {
    api: IDragTargetApi;
    clientXMovement: TClientMovement = new Set();
    clientYMovement: TClientMovement = new Set();
    slidingDirection: string[];
    isMouseDown: boolean;
    isRightClick: boolean;

    constructor(api: IDragTargetApi) {
        this.api = api;
    }
    get isX() {
        return 'top,bottom'.includes(this.api.side);
    }
    get isY() {
        return 'left,right'.includes(this.api.side);
    }

    onMouseDown(e){
        e.preventDefault();
        this.clientXMovement.clear();
        this.clientYMovement.clear();
        this.isMouseDown = true;
        this.isRightClick = this.detectRightClick(e);
    }

    onMouseMove(e){
        e.preventDefault();
        if(!this.isMouseDown || this.isRightClick) return;
        this.clientXMovement.add(e.clientX);
        this.clientYMovement.add(e.clientY);
        return true;
    }

    onMouseUp(e){
        e.preventDefault();
        this.updateSlideDirection();
        this.isMouseDown = false;
        return {
            slidingDirection: this.slidingDirection,
        };
    }

    private updateSlideDirection(){

        const latestXMovements = this.getNextAndPrevMovements(this.clientXMovement);

        const latestYMovements = this.getNextAndPrevMovements(this.clientYMovement);
        if(!latestXMovements && !latestYMovements) return;
        const slideDirections = {
            isSlideDown: latestYMovements.prev > latestYMovements.next,
            isSlideUp: latestYMovements.prev < latestYMovements.next,
            isSlideLeft: latestXMovements.prev < latestXMovements.next,
            isSlideRight: latestXMovements.prev > latestXMovements.next,
        };

        const result = Object.entries(slideDirections).filter(e => e[1]).map(e => e[0]);

        this.slidingDirection = result;

    }
    private getNextAndPrevMovements = (clientMovement: TClientMovement) => {
        if(!clientMovement.size) return;
        const vals = [...clientMovement.values()];
        const prev = vals.pop();
        const next = vals.pop();

        return {prev, next};
    }

    private detectRightClick(e){
        return e.which !== 1;
    }

}