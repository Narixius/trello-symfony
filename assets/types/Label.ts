import {WithBlameable, WithTimestamps} from "./index";

export type Label = WithTimestamps<WithBlameable<{
    id: number;
    title: string;
    color: string;
}>>