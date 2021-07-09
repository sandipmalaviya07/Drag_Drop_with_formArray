
export interface ICustomerDocument {
    customerName: string;
    documents: IDocument[];
}

export interface IDocument {
    docName: string;
    orderNumber: number;
}