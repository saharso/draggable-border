import TDragTargetUtilOptions from './TDragTargetUtilOptions';
import IDragTargetApi from './IDragTargetApi';

export type THorizontalKey = 'horizontal' | 'vertical';

export default class DragTargetRectUtil {
    horizontal: boolean;
    api: IDragTargetApi;
    static draggerCollectionX: HTMLElement[] = [];
    static targetCollectionX: HTMLElement[] = [];
    static draggerCollectionY: HTMLElement[] = [];
    static targetCollectionY: HTMLElement[] = [];

    constructor(api: IDragTargetApi) {
        this.api = api;
        this.horizontal = api.horizontal;
        this.setElementsCollection(api.draggerElement, api.targetElement);
    }

    get horizontalKey(): THorizontalKey { return this.horizontal ? 'horizontal' : 'vertical';}
    get className(): string {return `is-${this.horizontalKey}`;}

    static handleDraggersRect(draggerElement, index, horizontalKey: THorizontalKey) {
        const options: TDragTargetUtilOptions = {
            horizontal: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionX[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionX[index].getBoundingClientRect().right + 'px';
                draggerElement.style.height = DragTargetRectUtil.targetCollectionX[index].offsetHeight + 'px';
            },
            vertical: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionY[index].getBoundingClientRect().top - draggerElement.offsetHeight + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionY[index].getBoundingClientRect().left + 'px';
                draggerElement.style.width = DragTargetRectUtil.targetCollectionY[index].offsetWidth + 'px';
            }
        };
        options[horizontalKey]();
    }

    setElementsCollection(draggerElement, targetElement) {
        const options: TDragTargetUtilOptions = {
            horizontal: () => {
                DragTargetRectUtil.draggerCollectionX.push(draggerElement);
                DragTargetRectUtil.targetCollectionX.push(targetElement);
            },
            vertical: () => {
                DragTargetRectUtil.draggerCollectionY.push(draggerElement);
                DragTargetRectUtil.targetCollectionY.push(targetElement);
            }
        };
        options[this.horizontalKey]();
    }

    calculateTargetRect(e, targetElement){
        const options: TDragTargetUtilOptions = {
            horizontal: () => {
                const cursorXPosition = e.clientX;
                const targetOriginalWidth = targetElement.offsetWidth;
                const targetElementLeftPosition = targetElement.getBoundingClientRect().left;

                const formula = targetOriginalWidth - targetElementLeftPosition + (cursorXPosition - targetOriginalWidth);

                return formula;
            },
            vertical: () => {
                const cursorYPosition = e.clientY;
                const targetOriginalHeight = targetElement.offsetHeight;
                const targetElementTopPosition = targetElement.getBoundingClientRect().top;
                const targetElementBottomPosition = targetElement.getBoundingClientRect().bottom;

                const formula = targetOriginalHeight - (cursorYPosition - targetElementTopPosition);

                return formula;
            }
        };
        return options[this.horizontalKey]();

    }

    updateTargetElementDimensions(targetElement, formula){
        const options: TDragTargetUtilOptions = {
            horizontal: () => {
                targetElement.style.width = formula + 'px';
            },
            vertical: () => {
                targetElement.style.height = formula + 'px';
            }
        };
        options[this.horizontalKey]();
    }

    allowSnap(targetElement, snap){
        const options: TDragTargetUtilOptions = {
            horizontal: () => {
                return targetElement.offsetWidth <= snap;
            },
            vertical: () => {
                return targetElement.offsetHeight <= snap;
            }
        };
        return options[this.horizontalKey]();
    }
    draggerElementDim(draggerElement){
        const options: TDragTargetUtilOptions = {
            horizontal: () => {
                return draggerElement.offsetWidth;
            },
            vertical: () => {
                return draggerElement.offsetHeight;
            }
        };
        return options[this.horizontalKey]();
    }
    updateDraggingElementsRect(){
        requestAnimationFrame(()=>{
            DragTargetRectUtil.draggerCollectionX.forEach((draggerElement, index) => {
                DragTargetRectUtil.handleDraggersRect(draggerElement, index, 'horizontal');
            });
            DragTargetRectUtil.draggerCollectionY.forEach((draggerElement, index) => {
                DragTargetRectUtil.handleDraggersRect(draggerElement, index, 'vertical');
            });
        });
    }


};
