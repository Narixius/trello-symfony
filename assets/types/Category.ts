import {WithBlameable, WithTimestamps} from "./index";
import {Card} from "./Card";

export type Category = WithTimestamps<WithBlameable<{
    id: number;
    title: string;
    orderNumber: number;
    cards: Card[]
}>>