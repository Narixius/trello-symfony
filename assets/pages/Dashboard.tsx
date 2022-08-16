import * as React from 'react'
import Logo from "../components/Logo";
import {Container} from "../components/Container";
import {Board} from "../types/Board";
import {AddBoardCard, BoardCard} from "../components/BoardCard";
import {User} from "../types/User";
import {Navbar} from "../components/Navbar";
import {Errors} from "../types/Error";

export default function Dashboard(props:{
    boards: Board[],
    user: User,
    errors: Errors
}) {
  const {boards, user} = props
  return (
      <Container className="pt-4">
          <Navbar user={user} />
          <div className={"flex space-x-2 items-center  mt-1"}>
              <Logo className={"w-7 h-7"} />
              <h1 className={"text-2xl font-medium"}>Boards</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              {
                  boards.map((board)=>{
                    return <BoardCard board={board} key={board.id} />
                  })
              }
              <AddBoardCard />
          </div>

      </Container>)
}
