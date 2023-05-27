export {};

declare global {
interface Window {
    MSStream: any;
}
interface marker{
    addListener: any;
}
}