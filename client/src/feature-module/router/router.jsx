import React from "react";
import { Route, Routes } from "react-router";
import { authRoutes, publicRoutes, errorsAndLogoutRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login/login";
import { ProtectedRoute } from '../../utils/ProtectedRoute';
import { PublicRoute } from '../../utils/PublicRoute';
import Error404 from "../pages/error/error-404";

const ALLRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route element={<Feature />}>
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} element={<ProtectedRoute>{route.element}</ProtectedRoute>} key={idx} />
        ))}
      </Route>

      <Route element={<AuthFeature />}>
        {authRoutes.map((route, idx) => (
          <Route path={route.path} element={<PublicRoute>{route.element}</PublicRoute>} key={idx} />
        ))}
      </Route>

      <Route element={<AuthFeature />}>
        {errorsAndLogoutRoutes.map((route, idx) => (
          <Route path={route.path} element={route.element} key={idx} />
        ))}
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default ALLRoutes;
