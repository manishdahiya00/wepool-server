export interface ICreateUser {
    fullName: string;
    email: string;
    hashedPassword: string;
    securityToken: string;
    deviceId: string;
    deviceType: string;
    deviceName: string;
}
