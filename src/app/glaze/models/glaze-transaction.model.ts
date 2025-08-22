export interface GlazeTransaction {
    id: string;
    createdAt: string;
    updatedAt: string;
    quantity: number;
    type: string;
    glazeColor: string;
    productTxId: number | null;
    resourceTotalCostAtTime: number;
    machineEnergyConsumptionCostAtTime: number;
    glazeFinalCostAtTime: number;
}
