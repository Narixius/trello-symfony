import {WithBlameable, WithTimestamps} from "./index";

export type Label = WithTimestamps<WithBlameable<{
    id: string;
    title: string;
    color: string;
}>>