import TDragTargetUtilOptions from './TDragTargetUtilOptions';
import IDragTargetApi from './IDragTargetApi';

export type THorizontalKey = 'top' | 'right' | 'left' | 'bottom';

export default class DragTargetRectUtil {
    horizontal: boolean;
    api: IDragTargetApi;
    static draggerCollectionX: HTMLElement[] = [];
    static targetCollectionX: HTMLElement[] = [];
    static draggerCollectionY: HTMLElement[] = [];
    static targetCollectionY: HTMLElement[] = [];
    static draggerCollectionLeft: HTMLElement[] = [];
    static targetCollectionLeft: HTMLElement[] = [];
    static draggerCollectionBottom: HTMLElement[] = [];
    static targetCollectionBottom: HTMLElement[] = [];

    constructor(api: IDragTargetApi) {
        this.api = api;
        this.horizontal = api.horizontal;
        this.setElementsCollection(api.draggerElement, api.targetElement);
    }

    get horizontalKey(): THorizontalKey {
        if(this.api.horizontal && this.api.invertSlide){
            return 'left';
        }
        else if(!this.api.horizontal && this.api.invertSlide){
            return 'bottom';
        }
        else {
            return this.api.horizontal ? 'top' : 'right';
        }
    }
    get className(): string {return `is-${this.horizontalKey}`;}

    static handleDraggersRect(draggerElement: HTMLElement, index: number, horizontalKey: THorizontalKey) {
        const options: TDragTargetUtilOptions = {
            top: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionX[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionX[index].getBoundingClientRect().right + 'px';
                draggerElement.style.height = DragTargetRectUtil.targetCollectionX[index].offsetHeight + 'px';
            },
            right: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionY[index].getBoundingClientRect().top - draggerElement.offsetHeight + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionY[index].getBoundingClientRect().left + 'px';
                draggerElement.style.width = DragTargetRectUtil.targetCollectionY[index].offsetWidth + 'px';
            },
            left: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionLeft[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionLeft[index].getBoundingClientRect().left + 'px';
                draggerElement.style.height = DragTargetRectUtil.targetCollectionLeft[index].offsetHeight + 'px';
            },
            bottom: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionBottom[index].getBoundingClientRect().bottom + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionBottom[index].getBoundingClientRect().left + 'px';
                draggerElement.style.width = DragTargetRectUtil.targetCollectionBottom[index].offsetWidth + 'px';
            }
        };
        options[horizontalKey]();
    }

    private setElementsCollection(draggerElement, targetElement) {
        const options: TDragTargetUtilOptions = {
            top: () => {
                DragTargetRectUtil.draggerCollectionX.push(draggerElement);
                DragTargetRectUtil.targetCollectionX.push(targetElement);
            },
            right: () => {
                DragTargetRectUtil.draggerCollectionY.push(draggerElement);
                DragTargetRectUtil.targetCollectionY.push(targetElement);
            },
            left: ()=>{
                DragTargetRectUtil.draggerCollectionLeft.push(draggerElement);
                DragTargetRectUtil.targetCollectionLeft.push(targetElement);
            },
            bottom: ()=>{
                DragTargetRectUtil.draggerCollectionBottom.push(draggerElement);
                DragTargetRectUtil.targetCollectionBottom.push(targetElement);
            },
        };
        options[this.horizontalKey]();
    }

    calculateTargetDimension(e, targetElement){
        const options: TDragTargetUtilOptions = {
            top: () => {
                const cursorXPosition = e.clientX;
                const targetOriginalWidth = targetElement.offsetWidth;
                const targetElementLeftPosition = targetElement.getBoundingClientRect().left;

                const formula = targetOriginalWidth - targetElementLeftPosition + (cursorXPosition - targetOriginalWidth);

                return formula;
            },
            right: () => {
                const cursorYPosition = e.clientY;
                const targetOriginalHeight = targetElement.offsetHeight;
                const targetElementTopPosition = targetElement.getBoundingClientRect().top;

                const formula = targetOriginalHeight - (cursorYPosition - targetElementTopPosition);

                return formula;
            },
            left: ()=>{
                const cursorXPosition = e.clientX;
                const targetElementLeftPosition = targetElement.getBoundingClientRect().right;

                const formula = targetElementLeftPosition - cursorXPosition;

                return formula;
            },
            bottom: ()=>{
                const cursorYPosition = e.clientY;
                const targetElementBottomPosition = targetElement.getBoundingClientRect().top;

                const formula = cursorYPosition - targetElementBottomPosition;

                return formula;
            },
        };
        return options[this.horizontalKey]();

    }

    updateTargetElementDimensions(targetElement, formula){
        const options: TDragTargetUtilOptions = {
            top: () => {
                targetElement.style.width = formula + 'px';
            },
            right: () => {
                targetElement.style.height = formula + 'px';
            },
            left: ()=>{
                targetElement.style.width = formula + 'px';
            },
            bottom: ()=>{
                targetElement.style.height = formula + 'px';
            },
        };
        options[this.horizontalKey]();
    }

    allowSnap(targetElement, snap){
        const options: TDragTargetUtilOptions = {
            top: () => {
                return targetElement.offsetWidth <= snap;
            },
            right: () => {
                return targetElement.offsetHeight <= snap;
            },
            left: ()=>{
                return targetElement.offsetWidth <= snap;
            },
            bottom: ()=>{
                return targetElement.offsetHeight <= snap;
            }
        };
        return options[this.horizontalKey]();
    }
    draggerElementDim(draggerElement){
        const options: TDragTargetUtilOptions = {
            top: () => {
                return draggerElement.offsetWidth;
            },
            right: () => {
                return draggerElement.offsetHeight;
            },
            left: ()=>{},
            bottom: ()=>{}
        };
        return options[this.horizontalKey]();
    }
    targetElementDim(targetElement) {
        const options: TDragTargetUtilOptions = {
            top: () => {
                return targetElement.offsetWidth;
            },
            right: () => {
                return targetElement.offsetHeight;
            },
            left: ()=>{},
            bottom: ()=>{}
        };
        return options[this.horizontalKey]();
    }
    updateDraggingElementsRect(){
        requestAnimationFrame(()=>{
            DragTargetRectUtil.draggerCollectionX.forEach((draggerElement, index) => {
                DragTargetRectUtil.handleDraggersRect(draggerElement, index, 'top');
            });
            DragTargetRectUtil.draggerCollectionY.forEach((draggerElement, index) => {
                DragTargetRectUtil.handleDraggersRect(draggerElement, index, 'right');
            });
            DragTargetRectUtil.draggerCollectionLeft.forEach((draggerElement, index) => {
                DragTargetRectUtil.handleDraggersRect(draggerElement, index, 'left');
            });
            DragTargetRectUtil.draggerCollectionBottom.forEach((draggerElement, index) => {
                DragTargetRectUtil.handleDraggersRect(draggerElement, index, 'bottom');
            });
        });
    }

};
