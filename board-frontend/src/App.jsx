import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import BoardList from "./components/BoardList";
import BoardDetail from "./components/BoardDetail";
import BoardWrite from "./components/BoardWrite";
import BoardEdit from "./components/BoardEdit";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/boards/new" element={<BoardWrite />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path="/boards/:id/edit" element={<BoardEdit />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;