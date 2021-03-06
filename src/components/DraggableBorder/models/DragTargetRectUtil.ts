import TDragTargetUtilOptions from './TDragTargetUtilOptions';
import IDragTargetApi from './IDragTargetApi';
import TRectSides from './TRectSides';
import getElement from '../utils/getElement';

export default class DragTargetRectUtil {
    horizontal: boolean;
    api: IDragTargetApi;
    static draggerCollectionTop: HTMLElement[] = [];
    static targetCollectionTop: HTMLElement[] = [];
    static draggerCollectionRight: HTMLElement[] = [];
    static targetCollectionRight: HTMLElement[] = [];
    static draggerCollectionLeft: HTMLElement[] = [];
    static targetCollectionLeft: HTMLElement[] = [];
    static draggerCollectionBottom: HTMLElement[] = [];
    static targetCollectionBottom: HTMLElement[] = [];

    constructor(api: IDragTargetApi) {
        this.api = api;
        this.setElementsCollection(api.draggerElement, getElement(api.targetElement));
    }

    get horizontalKey(): TRectSides {
        return this.api.side;
    }
    get className(): string {return `is-${this.horizontalKey}`;}

    static handleDraggersRect(draggerElement: HTMLElement, index: number, horizontalKey: TRectSides) {
        const options: TDragTargetUtilOptions = {
            top: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionTop[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionTop[index].getBoundingClientRect().left + 'px';
                draggerElement.style.width = DragTargetRectUtil.targetCollectionTop[index].offsetWidth + 'px';
            },
            right: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionRight[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionRight[index].getBoundingClientRect().right - draggerElement.offsetWidth + 'px';
                draggerElement.style.height = DragTargetRectUtil.targetCollectionRight[index].offsetHeight + 'px';
            },
            left: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionLeft[index].getBoundingClientRect().top + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionLeft[index].getBoundingClientRect().left + 'px';
                draggerElement.style.height = DragTargetRectUtil.targetCollectionLeft[index].offsetHeight + 'px';
            },
            bottom: ()=>{
                draggerElement.style.top = DragTargetRectUtil.targetCollectionBottom[index].getBoundingClientRect().bottom - draggerElement.offsetHeight + 'px';
                draggerElement.style.left = DragTargetRectUtil.targetCollectionBottom[index].getBoundingClientRect().left + 'px';
                draggerElement.style.width = DragTargetRectUtil.targetCollectionBottom[index].offsetWidth + 'px';
            }
        };
        options[horizontalKey]();
    }

    calculateTargetDimension(e, targetElement){
        const options: TDragTargetUtilOptions = {
            top: () => {
                const cursorYPosition = e.clientY;
                const targetElementBottomPosition = targetElement.getBoundingClientRect().bottom;

                const formula = targetElementBottomPosition - cursorYPosition ;

                return formula;
            },
            right: () => {
                const cursorXPosition = e.clientX;
                const targetElementLeftPosition = targetElement.getBoundingClientRect().left;

                const formula = cursorXPosition - targetElementLeftPosition;

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


    private setElementsCollection(draggerElement, targetElement) {
        const options: TDragTargetUtilOptions = {
            top: () => {
                DragTargetRectUtil.draggerCollectionTop.push(draggerElement);
                DragTargetRectUtil.targetCollectionTop.push(targetElement);
            },
            right: () => {
                DragTargetRectUtil.draggerCollectionRight.push(draggerElement);
                DragTargetRectUtil.targetCollectionRight.push(targetElement);
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


    updateTargetElementDimensions(targetElement, formula){
        const preventUpdate = this.preventUpdate(targetElement, formula);
        const options: TDragTargetUtilOptions = {
            top: () => {
                if(preventUpdate.top()) return;
                targetElement.style.height = formula + 'px';
            },
            right: () => {
                if(preventUpdate.right()) return;
                targetElement.style.width = formula + 'px';
            },
            left: ()=>{
                if(preventUpdate.left()) return;
                targetElement.style.width = formula + 'px';
            },
            bottom: ()=>{
                if(preventUpdate.bottom()) return;
                targetElement.style.height = formula + 'px';
            },
        };
        options[this.horizontalKey]();
    }

    preventUpdate(targetElement, formula): TDragTargetUtilOptions {
        return {
            top: ()=>{
                const parentTop = targetElement.parentNode.getBoundingClientRect().top;

                return parentTop > formula;
            },
            right: ()=>{
                const limit = window.innerWidth - targetElement.getBoundingClientRect().left;
                
                return formula > limit;
            },
            left: ()=>{},
            bottom: ()=>{},
        };
    }

    snap(draggerElement, targetElement: HTMLElement, eventResults){

        const dragDirection = eventResults.dragDirection;
        if(!dragDirection) return;

        const options: TDragTargetUtilOptions = {
            top: () => {
                const shouldSnapDown = dragDirection.isDragDown && targetElement.offsetHeight < this.api.snap;
                shouldSnapDown && requestAnimationFrame(()=>{
                    targetElement.style.height = draggerElement.offsetHeight + 'px';
                });
            },
            right: () => {
                console.log(dragDirection.isDragLeft, targetElement.offsetWidth , this.api.snap);
                const shouldSnapLeft = dragDirection.isDragLeft && targetElement.offsetWidth < this.api.snap;
                shouldSnapLeft && requestAnimationFrame(()=>{
                    targetElement.style.width = draggerElement.offsetWidth + 'px';
                });
            },
            left: ()=>{
                const shouldSnapRight = dragDirection.isDragRight && targetElement.offsetWidth < this.api.snap;
                shouldSnapRight && requestAnimationFrame(()=>{
                    targetElement.style.width = draggerElement.offsetWidth + 'px';
                });
            },
            bottom: ()=>{
                const shouldSnapUp = dragDirection.isDragUp && targetElement.offsetHeight < this.api.snap;
                shouldSnapUp && requestAnimationFrame(()=>{
                    targetElement.style.height = draggerElement.offsetHeight + 'px';
                });
            }
        };
        options[this.horizontalKey]();
        this.updateDraggingElementsRect();
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
            DragTargetRectUtil.draggerCollectionTop.forEach((draggerElement, index) => {
                DragTargetRectUtil.handleDraggersRect(draggerElement, index, 'top');
            });
            DragTargetRectUtil.draggerCollectionRight.forEach((draggerElement, index) => {
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
