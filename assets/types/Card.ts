import {User} from "./User";
import {Label} from "./Label";
import {WithBlameable, WithTimestamps} from "./index";
import {Comment} from "./Comment";

export type Card = WithTimestamps<WithBlameable<{
    id: number;
    title: string;
    description: string;
    dueDate?: Date;
    assignees: User[];
    labels: Label[];
    comments: Comment[];
    orderNumber: number;
    category?: number;
}>>