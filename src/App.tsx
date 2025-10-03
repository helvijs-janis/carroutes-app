import Homepage from "./pages/Homepage";
import { Provider } from "react-redux";
import store from "./components/redux/store";

const App: React.FC = () => (
  <Provider store={store}>
    <Homepage />
  </Provider>
);

export default App;
