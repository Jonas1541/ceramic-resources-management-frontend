import { Resource } from "../../resource/models/resource.model";

export interface GlazeResourceUsage {
    id: string;
    quantity: number;
    resource: Resource;
}
