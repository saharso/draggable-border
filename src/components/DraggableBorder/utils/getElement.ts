export default function getElement(data: HTMLElement | string): HTMLElement {
    if(typeof data === 'string') {
        return document.querySelector(data);
    } else {
        return data;
    }
}
