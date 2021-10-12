export default function getElement(data: HTMLElement | string): HTMLElement {
    console.log(data);
    if(typeof data === 'string') {
        console.log(document.querySelector(data));
        return document.querySelector(data);
    } else {
        return data;
    }
}
