export interface Resource {
    id: string;
    name: string;
    category: string;
    unitValue: number;
    currentQuantity: number;
    currentQuantityPrice: number;
}

export interface ResourceRequest {
    name: string;
    category: string;
    unitValue: number;
}
