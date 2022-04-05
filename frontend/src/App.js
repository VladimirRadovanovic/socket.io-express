import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import ChatApp from "./components/Chat/ChatApp";




function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

const user = useSelector(state => state.session.user)
console.log(user, 'user@@@@@@@@@')


// const URL = "http://localhost:5000";
// const socket = io();

// socket.on('message', message => {
//   console.log(message)
// })

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
          <Route path='/chat'>
            <ChatApp user={user} />
         </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
