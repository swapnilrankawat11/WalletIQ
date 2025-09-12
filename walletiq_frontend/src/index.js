import ReactDOM from "react-dom/client";
import App from "./App";
import { SessionProvider } from "./contexts/SessionContext";
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SessionProvider>
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  </SessionProvider>
);
