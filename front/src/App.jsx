import {Routes, Route} from 'react-router-dom'
import LoginForm from './pre-auth/login'
import RegisForm from './pre-auth/regis'
import Home from  './post-auth/home'
import GuestRoute from './routing/guest-route'
import PrivateRoute from './routing/private-route'
import NotFound from './routing/notfound'
import './App.css'

function App() {

  return (
    <Routes>
      <Route element={<GuestRoute/>}>
        <Route path='/' element={<LoginForm/>} ></Route>
        <Route path='/register' element={<RegisForm/>}></Route>
      </Route>
      <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
