import * as React from 'react'
import Logo from "../components/Logo";
import {Container} from "../components/Container";
import {Board} from "../types/Board";
import {User} from "../types/User";
import {Navbar} from "../components/Navbar";
import {Errors} from "../types/Error";
import {AddCategory, Category} from "../components/Category";

export default function Dashboard(props:{
    board: Board,
    user: User,
    errors: Errors
}) {
    const {board, user} = props
    const categories = !Array.isArray(board.categories) ? [] : board.categories;
    console.log(categories)
    return (
      <Container className="pt-4 min-h-screen flex flex-col">
          <Navbar user={user} />
          <div className={"flex space-x-2 items-center  mt-1"}>
              <Logo className={"w-7 h-7"} />
              <h1 className={"text-2xl font-medium"}>{board.title}</h1>
          </div>

          <div className="flex space-x-4 flex-nowrap mt-8 overflow-x-auto flex-grow">
              {
                  categories.sort((c1,c2)=>c1.orderNumber - c2.orderNumber).map((category)=>{
                      return <Category key={category.id} category={category} board={board} />
                  })
              }
              <AddCategory board={board} />
          </div>
      </Container>)
}
