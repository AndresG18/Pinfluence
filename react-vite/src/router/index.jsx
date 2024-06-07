import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';

import HomePage from '../components/HomePage/HomePage';
import ExporePage from '../components/ExplorePage/ExporePage';
import PinForm from '../components/PinComponents/PinForm';
import PinUpdate from '../components/PinComponents/PinUpdate';
import BoardForm from '../components/BoardComponents/BoardForm';
import BoardUpdate from '../components/BoardComponents/BoardUpdate';
import PinDetails from '../components/PinComponents/PinDetails';
import BoardDetails from '../components/BoardComponents/BoardDetails';
import Search from '../components/ExplorePage/Search';
// import UserForm from '../components/UserComponents/UserForm';
import UserPage from '../components/UserComponents/UserPage';
import Splash from '../components/HomePage/Splash';
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Splash/>,
      },
      {
        path: "/home",
        element: <HomePage/>,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "explore",
        element: <ExporePage/>,
      },
      {
        path: "/pins/:pinId",
        element: <PinDetails />,
      },
      {
        path: "/pins/new",
        element: <PinForm />,
      },
      {
        path: "/pins/:pinId/edit",
        element: <PinUpdate />,
      },
      {
        path: "/boards/:boardId/",
        element: <BoardDetails />,
      },
      {
        path: "/boards/new",
        element: <BoardForm />,
      },
      {
        path: "/boards/:boardId/edit",
        element: <BoardUpdate />,
      },
      {
        path: "/users/:userId",
        element: <UserPage/>,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
]);

// home page
// explore page
// pin form
// view pin 
// update pin form
// view profile
// edit profile form
//view board
// watever else is needed
