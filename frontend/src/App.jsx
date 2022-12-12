import React, { useEffect } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./page/Home/Home";
import SignIn from "./page/Auth/SignIn/SignIn";
import SignUp from "./page/Auth/SignUp/SignUp";
import Overview from "./page/introDanang/Overview/Overview";
import Weather from "./page/introDanang/Weather/Weather";
import History from "./page/introDanang/History/History";
import ActivationEmail from "./page/Auth/ActivationEmail/ActivationEmail";
import ForgotPassword from "./page/Auth/ForgotPassword/ForgotPassword";
import IntroDn from "./page/introDanang/IntroDn";
import EditUser from "./page/Auth/EditUser/EditUser";

//
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import NotFound from "./utils/NotFound/NotFound";
import ResetPassword from "./page/Auth/ResetPassword/ResetPassword";
import Profile from "./page/Auth/Profile/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  dispatchGetUser,
  dispatchLogin,
  fetchUser,
} from "./redux/actions/authAction";
import PlaceDetail from "./page/PlaceDetail/PlaceDetail";
import VisitLocation from "./page/TouristAttraction/VisitLocation/VisitLocation";
function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);
  const { isLogged, isAdmin } = auth;
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        const res = await axios.post("/api/user/refresh_token", null);
        dispatch({ type: "GET_TOKEN", payload: res.data.access_token });
      };
      getToken();
    }
  }, [auth.isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        dispatch(dispatchLogin());

        const res = await fetchUser(token);
        dispatch(dispatchGetUser(res));
      };
      getUser();
    }
  }, [token, dispatch]);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Layout Default */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dia-diem/:slug" element={<PlaceDetail />} />
            {/* Auth  */}
            <Route
              path="/profile"
              element={isLogged ? <Profile /> : <NotFound />}
            />
            <Route
              path="/edit_user/:id"
              element={isAdmin ? <EditUser /> : <NotFound />}
            />
            {/* Intro */}
            <Route path="/gioi-thieu" element={<IntroDn />} />
            <Route
              path="/gioi-thieu/tong-quan-da-nang"
              element={<Overview />}
            />
            <Route path="/gioi-thieu/thoi-tiet-da-nang" element={<Weather />} />
            <Route path="/gioi-thieu/lich-su-da-nang" element={<History />} />
            {/*  */}
            <Route path="/khu-vuc">
              <Route path="hai-chau" element={<Outlet />} />
              <Route path="son-tra" element={<Outlet />} />
              <Route path="ngu-hanh-son" element={<Outlet />} />
              <Route path="lien-chieu" element={<Outlet />} />
              <Route path="thanh-khe" element={<Outlet />} />
              <Route path="cam-le" element={<Outlet />} />
            </Route>

            {/* Diem du lich */}

            <Route
              path="/diem-du-lich/dia-diem-tham-quan"
              element={<VisitLocation />}
            />
            <Route path="bai-bien-dep" element={<Outlet />} />
            <Route path="van-hoa-tin-nguong-ban-dia" element={<Outlet />} />
            <Route path="dia-diem-vui-choi-hap-dan" element={<Outlet />} />
            <Route path="dia-diem-checkin-hap-dan" element={<Outlet />} />
          </Route>
          <Route path="/trai-nghiem">
            <Route path="khack-san" element={<Outlet />} />
            <Route path="tour-du-lich" element={<Outlet />} />
          </Route>
          <Route path="/lien-he" element={<Outlet />} />

          <Route
            path="/signin"
            element={isLogged ? <NotFound /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={isLogged ? <NotFound /> : <SignUp />}
          />
          <Route
            path="/forgot_password"
            element={isLogged ? <NotFound /> : <ForgotPassword />}
          />
          <Route
            path="/api/user/reset/:token"
            element={isLogged ? <NotFound /> : <ResetPassword />}
          />
          <Route
            path="/api/user/activation/:activation_token"
            element={<ActivationEmail />}
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          theme="colored"
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
