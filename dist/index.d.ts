declare const peopleEl: Element;
declare const randomizeButtonEl: HTMLButtonElement;
declare const formEl: HTMLFormElement;
declare const progressContainer: HTMLDivElement;
declare const progressEl: HTMLProgressElement;
declare const randInt: (exclMax: number) => number;
declare const createSequenceProgress: <T>(length: number, cb: () => T, done: (values: T[]) => void, perStep?: number) => void;
declare const createPerson: (numEncounters: number, shinyRate: number) => {
    shinies: number;
};
declare const median: (arr: number[]) => number;
declare const addPeopleToDom: () => void;
