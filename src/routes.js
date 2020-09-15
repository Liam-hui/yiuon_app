import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import store from "@/store";
import actions from "@/store/ducks/actions";
import storage from "@/utils/storage";
import { useSelector } from "react-redux";

import AuthStack from "@/navigation/AuthStack";
import MainStack from "@/navigation/MainStack";

const Routes = () => {
  useEffect(() => {
    _retrieveAuth();
  }, []);

  const _retrieveAuth = async () => {
    try {
      const auth = await storage.getAuth();
      if (auth !== null) {
        store.dispatch(actions.loginAction(JSON.parse(auth)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loggedIn = useSelector(state => state.auth_state.loggedIn);

  return (
    <NavigationContainer>
      {!loggedIn && <AuthStack />}
      {loggedIn && <MainStack />}
    </NavigationContainer>
  );
};
export default Routes;
