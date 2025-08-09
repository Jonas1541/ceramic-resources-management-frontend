export interface ResourceTransaction {
    id: number;
    type: string;
    quantity: number;
    resourceName: string;
    batchId: number;
    cost: number;
    createdAt: string;
    updatedAt: string;
}

export interface ResourceTransactionRequest {
    type: string;
    quantity: number;
}
