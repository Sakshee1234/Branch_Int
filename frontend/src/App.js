import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn';
import Chat from './components/Chat';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import ChatCustomer from './components/ChatCustomer';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/chatcust" element={<ChatCustomer />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
