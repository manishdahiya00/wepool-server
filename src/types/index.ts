import { User } from "@prisma/client";

export interface ICreateUser {
    fullName: string;
    email: string;
    hashedPassword: string;
    securityToken: string;
    deviceId: string;
    deviceType: string;
    deviceName: string;
    dob: string;
    mobileNumber: string;
}

declare module "express" {
    export interface Request {
        user?: User;
    }
}

export interface EmailJobData {
    email: string;
    otp: string;
}

export interface ICreateVehicle {
    userId: string;
    brand: string;
    model: string;
    color: string;
}
export interface IEditVehicle {
    vehicleId: string;
    brand: string;
    model: string;
    color: string;
}
