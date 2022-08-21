import {WithBlameable, WithTimestamps} from "./index";

export type Category = WithTimestamps<WithBlameable<{
    id: number;
    title: string;
    orderNumber: number;
}>>