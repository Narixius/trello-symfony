import {WithBlameable, WithTimestamps} from "./index";

export type Comment = WithTimestamps<WithBlameable<{
    id: number;
    text: string;
}>>