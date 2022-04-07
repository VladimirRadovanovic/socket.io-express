import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Redirect } from "react-router-dom";

import { SocketProvider, useSocket } from "./context/SocketProvider";
import ChatApp from "./components/Chat/ChatApp";




function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

const user = useSelector(state => state.session.user)


const socket = useSocket()


const chat = (
  <SocketProvider user={user}>
    <ChatApp user={user} />
  </SocketProvider>
)

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          { user ?
          (<Route path='/chat'>
              {chat}
         </Route>) :
         <Redirect to='/login' />}
        </Switch>
      )}
    </>
  );
}

export default App;
