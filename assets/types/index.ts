import {User} from "./User";

export type WithTimestamps<T> = T & {
    createdAt: Date;
    updatedAt: Date;
}

export type WithBlameable<T> = T & {
    updatedBy: User;
    createdBy: User;
}