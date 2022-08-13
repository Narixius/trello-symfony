import * as React from 'react'
import { createInertiaApp } from '@inertiajs/inertia-react'
import { createRoot } from 'react-dom/client';
import './tailwind.css'

const container = document.getElementById('app');
const root = createRoot(container!);

createInertiaApp({
  resolve: name => require(`./pages/${name}`),
  setup({ App, props }) {
    root.render(<App {...props} />);
  },
})
