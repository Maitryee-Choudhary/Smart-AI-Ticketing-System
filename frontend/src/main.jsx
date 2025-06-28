import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckAuth from './components/checkAuth.jsx'
import Admin from './pages/admin.jsx'
import Tickets from './pages/tickets.jsx'
import Ticket from './pages/ticket.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Logout from './pages/logout.jsx'
import Navbar from './pages/navbar.jsx'
import UserProfile from './pages/user.jsx'
import MyAssignedTickets from './pages/assignedTickets.jsx'
import TicketUpdate from './pages/updateTicket.jsx'
import UpdateTicketAssign from './pages/updateTicketAssign.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <Navbar />
       <Routes>
         <Route 
           path='/login'
           element={
            <CheckAuth protectedRoute={false} >
               <Login />
            </CheckAuth>
           }
         />
          <Route 
           path='/signup'
           element={
            <CheckAuth protectedRoute={false} >
               <Signup />
            </CheckAuth>
           }
         />
          <Route 
           path='/logout'
           element={
            <CheckAuth protectedRoute={true} >
               <Logout />
            </CheckAuth>
           }
         />
         <Route 
           path='/'
           element={
            <CheckAuth protectedRoute={true} >
               <Tickets />
            </CheckAuth>
           }
         />
         <Route 
           path='/profile'
           element={
            <CheckAuth protectedRoute={true} >
               <UserProfile />
            </CheckAuth>
           }
         />
         <Route 
           path='/assigned'
           element={
            <CheckAuth protectedRoute={true} >
               <MyAssignedTickets />
            </CheckAuth>
           }
         />
         <Route 
           path='/tickets/:id/update'
           element={
            <CheckAuth protectedRoute={true} >
               <TicketUpdate />
            </CheckAuth>
           }
         />
         <Route 
           path='/tickets/:id/updateAssinger'
           element={
            <CheckAuth protectedRoute={true} >
               <UpdateTicketAssign />
            </CheckAuth>
           }
         />
         
         <Route 
           path='/tickets/:id'
           element={
            <CheckAuth protectedRoute={true} >
               <Ticket />
            </CheckAuth>
           }
         />
         
         <Route 
           path='/admin'
           element={
            <CheckAuth protectedRoute={true} >
               <Admin />
            </CheckAuth>
           }
         />
       </Routes>
      
    </BrowserRouter>
  </StrictMode>
)
