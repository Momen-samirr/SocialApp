import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./lib/axios";
import toast from "react-hot-toast";
import NotificationsPage from "./pages/NotificationsPage";
import ConnectionPage from "./pages/ConnectionPage";
import PostPage from "./components/PostPage";
import ProfilePage from "./pages/ProfilePage";
function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err?.response?.data?.message);
      }
    },
  });

  if (isLoading) return null;

  if (authUser) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = `
    (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: '67521fd0e97901d2b54af0f6' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production'
        });
      }
      v.src = "https://cdn.voiceflow.com/widget/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
  })(document, 'script');
  `;
    document.body.appendChild(script);
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notifications"
          element={
            authUser ? <NotificationsPage /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/network"
          element={authUser ? <ConnectionPage /> : <Navigate to={"/login"} />}
        />
        <Route path="post/:postId" element={<PostPage />} />
        <Route path="/profile/:userName" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
