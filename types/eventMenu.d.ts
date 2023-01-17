declare class CombatEventMenu extends HTMLElement {
    _content: DocumentFragment;
    _title: HTMLElement;
    _startButton: HTMLElement;
    _passiveButton: HTMLElement;
    connectedCallback(): void;
    setButtonCallbacks(): void;
}
