import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PostPage from "./pages/PostPage";

import BlogForm from "./pages/BlogForm";

import { UserContextProvider } from "./UserContext";

function App() {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/create" element={<BlogForm />} />
            <Route path="/post/:id" element={<PostPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
