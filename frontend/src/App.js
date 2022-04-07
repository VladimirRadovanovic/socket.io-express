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
console.log(user, 'user@@@@@@@@@')

const socket = useSocket()
console.log(socket, 'socket@@@@@@@@@@@@!!!!!!!!!!!')


// const URL = "http://localhost:5000";
// const socket = io();

// socket.on('message', message => {
//   console.log(message)
// })
const chat = (
  <SocketProvider user={user}>
    {/* <div>
      {user?.username}
      chat app
    </div> */}
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
            {/* <ChatApp user={user} /> */}
              {chat}
         </Route>) :
         <Redirect to='/login' />}
        </Switch>
      )}
    </>
  );
}

export default App;
