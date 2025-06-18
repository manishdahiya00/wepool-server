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
    gender: string;
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

export interface ICreateRide {
    userId: string;
    vehicleId: string;
    from: string;
    subFrom: string;
    fromLat: string;
    fromLong: string;
    to: string;
    subTo: string;
    toLat: string;
    toLong: string;
    date: string;
    time: string;
    noOfSeats: number;
    pricePerSeat: number;
    summary: string;
    stopovers: string[];
}

export interface IEditRide {
    userId: string;
    id: string;
    vehicleId: string;
    from: string;
    subFrom: string;
    fromLat: string;
    fromLong: string;
    to: string;
    subTo: string;
    toLat: string;
    toLong: string;
    date: string;
    time: string;
    noOfSeats: number;
    pricePerSeat: number;
    summary: string;
    stopovers: string[];
}
export interface ISearchRide {
    from: string;
    to: string;
    fromLat: string;
    fromLng: string;
    toLat: string;
    toLng: string;
    date: string;
    noOfSeats: number;
    userId: string;
}

export interface ICreateStopOvers {
    userId: string;
    rideId: string;
    titles: string[];
}
