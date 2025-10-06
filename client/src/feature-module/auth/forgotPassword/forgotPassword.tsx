import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { postResetPasswordEmail } from "./src/forgotpasswordApis";
import toast from "react-hot-toast";
import enErrors from '../../../languages/enErrors.json';

const ForgotPassword = () => {
  const routes = auth_routes;
  
  const navigation = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    postResetPasswordEmail({ email })
      .then(() => {
        navigation(routes.forgotPasswordSuccess);
      })
      .catch((error) => {
        if (error.response?.status === 422) {
          // Laravel validation errors
          const validationErrors = error.response?.data?.data;

          if (validationErrors && validationErrors.email) {
            toast.error(validationErrors.email[0], {
              duration: 5000,
              id: validationErrors.email[0],
            });
          } else {
            toast.error("Invalid input. Please check your email and try again.", {
              duration: 5000,
              id: "validation_error",
            });
          }
        }
      })
      .finally(() => setLoading(false));
  };


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column justify-content-between vh-100">
              <div className="mx-auto p-4 text-center">
                <ImageWithBasePath
                  src="assets/img/logo.png"
                  className="img-fluid"
                  alt="Logo"
                  height={200}
                  width={200}
                />
              </div>
              <div className="card">
                <div className="card-body p-4">
                  <div className="mb-4">
                    <h2 className="mb-2">Forgot Password?</h2>
                    <p className="mb-0">
                      If you forgot your password, we’ll email you instructions
                      to reset it.
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-icon mb-3 position-relative">
                      <span className="input-icon-addon">
                        <i className="ti ti-mail" />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </div>
                  <div className="text-center">
                    <h6 className="fw-normal text-dark mb-0">
                      Return to{" "}
                      <Link to={routes.login} className="hover-a">
                        Login
                      </Link>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="p-4 text-center">
                <p className="mb-0">Copyright © 2024 - Cloud Notes</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
