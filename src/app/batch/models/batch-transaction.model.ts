import { Batch } from "./batch.model";

export interface BatchTransaction {
    id: string;
    quantity: number;
    batch: Batch;
}
