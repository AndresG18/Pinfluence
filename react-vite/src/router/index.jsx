import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import HomePage from '../components/HomePage/HomePage';
import ExporePage from '../components/ExplorePage/ExporePage';
import PinForm from '../components/PinForm/PinForm';
import PinUpdate from '../components/PinUpdate/PinUpdate';
import BoardForm from '../components/BoardForm/BoardForm';
import BoardUpdate from '../components/BoardUpdate/BoardUpdate';
import PinDetails from '../components/PinDetails/PinDetails';
import BoardDetails from '../components/BoardDetails/BoardDetails';
import Search from '../components/ExplorePage/Search';
import UserPage from '../components/UserPage/index';
import Splash from '../components/Splash/index';
import Messages from '../components/Messages/Messages';
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
      {
        path:'/messages',
        element:<Messages/>
      }
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
