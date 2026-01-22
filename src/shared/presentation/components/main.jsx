import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../styles/index.css"
import App from "./App.jsx"
import { Provider } from "react-redux"
import store from "../../infrastructure/store.js"
import { ThemeProvider } from "./ThemeProvider.jsx"
import { SocketProvider } from "@/context/SocketContext"



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <SocketProvider>
          <App /> 
        </SocketProvider>
      </ThemeProvider>      
    </Provider>
  </StrictMode>,
)

