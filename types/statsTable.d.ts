declare class StatsTable extends HTMLElement {
    _rows: any[];
    _data: {
        tableID: string;
        borderClass: string;
        title: string;
        rows: any[];
        trackerKey: string;
    };
    _content: DocumentFragment;
    _title: HTMLElement;
    _body: HTMLElement;
    _border: HTMLElement;
    connectedCallback(): void;
    removeRows(): void;
    setData(data: any): void;
    addRow(rowData: any): void;
    updateRowValues(): void;
    formatRowData(rowData: any): any;
    localize(): void;
}
