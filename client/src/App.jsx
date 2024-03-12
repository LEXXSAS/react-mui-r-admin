import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {createContext} from 'react';
import Layout from './components/Layout'
import NotFound from './pages/NotFound';
import Loginpage from './pages/Loginpage';
import Register from './pages/Register';
import Users from './Users'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import DetailsUser from "./DetailsUser";
import { AppContext } from './components/context';
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css'
import Store from "./store/store";
import Other from "./pages/Other";
import Othertwo from "./pages/Othertwo";
import Adminlistpage from "./Adminlistpage";
import Statistics from "./pages/Statistics";
import DetailsUsertwo from "./DetailsUsertwo";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Loginpage />} />
      <Route path="register" element={<Register />} />
      <Route path="users/:p" element={<Users />} />
      <Route path="users" element={<Users />} />
      <Route path="create" element={<CreateUser />} />
      <Route path="update/:id" element={<UpdateUser />} />
      <Route path="view/:id" element={<DetailsUser />} />
      <Route path="viewtwo/:id" element={<DetailsUsertwo />} />
      <Route path="otherpage" element={<Other />} />
      <Route path="otherpage/:p" element={<Other />} />
      <Route path="othertwo" element={<Othertwo />} />
      <Route path="statistics" element={<Statistics />} />
      <Route path="adminlistpage" element={<Adminlistpage />} />
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

const store = new Store();

export const Context = createContext({
  store,
})

const App = (() => {
  const [udata, setUdata] = useState();
  const [updata, setUpdata] = useState();
  const [udelete, setUDelete] = useState();

  return (
    <Context.Provider value={{store}}>
      <AppContext.Provider value={{udata, setUdata, updata, setUpdata, udelete, setUDelete}}>
        <RouterProvider router={router} />
      </AppContext.Provider>
    </Context.Provider>
  )
})

export default App;
