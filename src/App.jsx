import { useState } from 'react'
import './App.css'
import Login from './components/login/Login'
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import Register from './components/register/Register';
import Dasboard from './components/dashboard/Dasboard';
import { CompanyProvider } from './context/CompanyContext';
import Home from './components/home/Home';
import Settings from './components/settings/Settings';
import Invoices from './components/invoices/Invoices';
import { AuthProvider } from './AuthProvider';
import CreateInvoices from './components/createInvoice/CreateInvoices';
import InvoiceDetail from './components/InvoiceDetail/InvoiceDetail';
function App() {
  const [count, setCount] = useState(0)
  const router= createBrowserRouter([
    {path:'', Component:Login},
    {path:'/login', Component:Login},
    {path: '/register', Component:Register},
    {path: '/dashboard', Component:Dasboard, children:[
      {path: '', Component:Home},
      {path: 'home',Component:Home},
      {path: 'settings', Component:Settings},
      {path: 'invoices', Component:Invoices},
      {path: 'create_invoices', Component: CreateInvoices},
      {path: 'invoice_detail', Component: InvoiceDetail}
    ]}
  ]
  )
  return (
    <>
        <AuthProvider>

    <CompanyProvider>
      <RouterProvider router={router}>

      </RouterProvider>
    </CompanyProvider>

    </AuthProvider>

    </>
  )
}

export default App
