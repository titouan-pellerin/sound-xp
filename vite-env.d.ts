/// <reference types="vite/client" />

declare module "*.vert" {
    const content: string;
    export default content;
}
declare module "*.frag" {
    const content: string;
    export default content;
}
declare module "*.fs" {
    const content: string;
    export default content;
}
declare module "*.vs" {
    const content: string;
    export default content;
}
declare module "*.glsl" {
    const content: string;
    export default content;
}

declare module "virtual-scroll";
declare module "stats-js";