import IDragTargetApi from './IDragTargetApi';

type TClientMovement = Set<number>;

type TDragDirection = {
    isDragDown: boolean;
    isDragUp: boolean;
    isDragLeft: boolean;
    isDragRight: boolean;

}

type TEventResults = {
    allowMouseMoveHandling?: boolean;
    dragDirection?: TDragDirection;
}

export default class DragTargetEventsUtil {
    private api: IDragTargetApi;
    private clientXMovement: TClientMovement = new Set();
    private clientYMovement: TClientMovement = new Set();
    private eventResults: TEventResults = {}
    private isMouseDown: boolean;
    private isRightClick: boolean;

    constructor(api: IDragTargetApi) {
        this.api = api;
    }

    public onMouseDown(e){
        e.preventDefault();
        this.clientXMovement.clear();
        this.clientYMovement.clear();
        this.isMouseDown = true;
        this.isRightClick = this.detectRightClick(e);
    }

    public onMouseMove(e){
        e.preventDefault();
        this.eventResults.allowMouseMoveHandling = this.isMouseDown && !this.isRightClick;
        if(!this.eventResults.allowMouseMoveHandling) return;
        this.clientXMovement.add(e.clientX);
        this.clientYMovement.add(e.clientY);
    }

    public onMouseUp(e){
        e.preventDefault();
        this.updateSlideDirection();
        this.isMouseDown = false;
    }

    public getFinalEventResults() {
        return this.eventResults;
    }

    private updateSlideDirection(){

        const latestXMovements = this.getNextAndPrevMovements(this.clientXMovement);

        const latestYMovements = this.getNextAndPrevMovements(this.clientYMovement);
        if(!latestXMovements && !latestYMovements) return;
        const slideDirections: TDragDirection = {
            isDragDown: latestYMovements.prev > latestYMovements.next,
            isDragUp: latestYMovements.prev < latestYMovements.next,
            isDragLeft: latestXMovements.prev < latestXMovements.next,
            isDragRight: latestXMovements.prev > latestXMovements.next,
        };

        this.eventResults.dragDirection = slideDirections;

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