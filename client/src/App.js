import TextEditor from "./TextEditor";
import "./styles.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import {v4 as uuidV4} from 'uuid'
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<Navigate to={`/documents/${uuidV4()}`} />}
        ></Route>
        <Route path="/documents/:id" element={<TextEditor />}></Route>
      </Routes>
      <TextEditor />
    </Router>
  );
}

export default App;
