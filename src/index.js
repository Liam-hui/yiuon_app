import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import store from "@/store";
import Routes from "@/routes";

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Routes />
      </PaperProvider>
    </Provider>
  );
}
console.disableYellowBox = true;
