import {User} from "./User";
import {Category} from "./Category";
import {WithBlameable, WithTimestamps} from "./index";
import {Label} from "./Label";

export type Board = WithTimestamps<WithBlameable<{
    id: number;
    title: string;
    color?: string;
    categories: Category[];
    members: User[];
    labels: Label[]
}>>