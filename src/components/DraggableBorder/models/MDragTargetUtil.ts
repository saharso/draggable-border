import TDragTargetUtilOptions from './TDragTargetUtilOptions';

export default class DragTargetUtil {
    horizontal: boolean;
    static draggerCollectionX: HTMLElement[] = [];
    static targetCollectionX: HTMLElement[] = [];
    static draggerCollectionY: HTMLElement[] = [];
    static targetCollectionY: HTMLElement[] = [];

    constructor(horizontal: boolean) {
        this.horizontal = horizontal;
    }

    get horizontalKey(){ return this.horizontal ? 'horizontal' : 'vertical';}
    get className(): string {return `is-${this.horizontalKey}`;}

    handleDraggersRect(draggerElement, index) {
        const options: TDragTargetUtilOptions = {
            horizontal: ()=>{
                draggerElement.style.top = DragTargetUtil.targetCollectionX[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTargetUtil.targetCollectionX[index].getBoundingClientRect().right + 'px';
                draggerElement.style.height = DragTargetUtil.targetCollectionX[index].offsetHeight + 'px';
            },
            vertical: ()=>{
                draggerElement.style.top = DragTargetUtil.targetCollectionY[index].getBoundingClientRect().top - draggerElement.offsetHeight + 'px';
                draggerElement.style.left = DragTargetUtil.targetCollectionY[index].getBoundingClientRect().left + 'px';
                draggerElement.style.width = DragTargetUtil.targetCollectionY[index].offsetWidth + 'px';
            }
        };
        options[this.horizontalKey]();
    }

    setCollection(draggerElement, targetElement) {
        const options: TDragTargetUtilOptions = {
            horizontal: () => {
                DragTargetUtil.draggerCollectionX.push(draggerElement);
                DragTargetUtil.targetCollectionX.push(targetElement);
            },
            vertical: () => {
                DragTargetUtil.draggerCollectionY.push(draggerElement);
                DragTargetUtil.targetCollectionY.push(targetElement);
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
            DragTargetUtil.draggerCollectionX.forEach((draggerElement, index) => {
                new DragTargetUtil(true).handleDraggersRect(draggerElement, index);
            });
            DragTargetUtil.draggerCollectionY.forEach((draggerElement, index) => {
                new DragTargetUtil(false).handleDraggersRect(draggerElement, index);
            });
        });
    }


};
