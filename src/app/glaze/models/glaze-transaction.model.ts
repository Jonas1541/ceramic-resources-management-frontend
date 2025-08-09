export interface GlazeTransaction {
    id: string;
    createdAt: string;
    updatedAt: string;
    quantity: number;
    type: string;
    glazeColor: string;
    resourceTotalCostAtTime: number;
    machineEnergyConsumptionCostAtTime: number;
    glazeFinalCostAtTime: number;
}
