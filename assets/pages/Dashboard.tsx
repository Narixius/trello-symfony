import * as React from 'react'
import { Inertia } from '@inertiajs/inertia'

export default function Dashboard(props: any) {
  const onClick = () => {
    Inertia.post('/inertia/create', { d: 'hi' })
  }
  return <div>
    <button className="bg-red-500" onClick={onClick}>click</button>
    <div>{JSON.stringify(props)}</div>
  </div>
}
