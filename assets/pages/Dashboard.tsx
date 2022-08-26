import * as React from 'react'
import Logo from "../components/Logo";
import {Container} from "../components/Container";
import {Board} from "../types/Board";
import {AddBoardCard, BoardCard} from "../components/BoardCard";
import {User} from "../types/User";
import {Navbar} from "../components/Navbar";
import {Errors} from "../types/Error";
import {Link} from "@inertiajs/inertia-react";
import {Messages} from "../messages";

export default function Dashboard(props:{
    boards: Board[],
    user: User,
    errors: Errors,
    messages: Record<string, string>,
    locale: string
}) {
  const {boards, user} = props
    Messages.setMessages(props.messages)
    Messages.setLocale(props.locale)
  return (
      <Container className="pt-4">
          <Navbar user={user} />
          <div className={"flex space-x-2 items-center  mt-1"}>
              <Logo className={"w-7 h-7"} />
              <h1 className={"text-2xl font-medium"}>{Messages.trans("Boards")}</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
              {
                  boards.map((board)=>{
                    return <Link href={ Messages.locale + `/board/${board.id}`} key={board.id} method="get" headers={{
                        'Content-Type': 'plain/txt'
                    }}>
                        <BoardCard board={board} key={board.id} />
                    </Link>
                  })
              }
              <AddBoardCard />
          </div>

      </Container>)
}
