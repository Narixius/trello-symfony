import {User} from "./User";
import {Category} from "./Category";
import {WithBlameable, WithTimestamps} from "./index";

export type Board = WithTimestamps<WithBlameable<{
    id: number;
    title: string;
    color?: string;
    categories: Category[];
}>>