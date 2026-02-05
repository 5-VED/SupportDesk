// Common TypeScript type definitions
export interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface ITicket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    assigneeId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrganization {
    id: string;
    name: string;
    domain: string;
    createdAt: Date;
}
