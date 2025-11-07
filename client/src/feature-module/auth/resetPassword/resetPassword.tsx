import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { auth_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { postResetPassword, checkTokenValidity } from "./src/resetpasswordApis";
import toast from "react-hot-toast";
import enErrors from '../../../languages/enErrors.json';

type PasswordField = "newPassword" | "confirmPassword";

const ResetPassword: React.FC = () => {
  const routes = auth_routes;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: PasswordField) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ✅ Check if token is valid on page load
  useEffect(() => {
    if (!email || !token) {
      toast.error("Invalid reset link");
      navigate(routes.login);
      return;
    }

     checkTokenValidity({ email, token })
     .then((res) => {
        if (!res) {
          toast.error("Reset link is invalid or expired.");
          navigate(routes.login);
        }
      })
      .catch(() => {
        toast.error("Reset link is invalid or expired.");
        navigate(routes.login);
      });
    
  }, [email, token, navigate, routes.login]);

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (passwords.newPassword !== passwords.confirmPassword) {
    toast.error(enErrors["passwords_do_not_match"] ?? "Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    await postResetPassword({
      email,
      token,
      password: passwords.newPassword,
      password_confirmation: passwords.confirmPassword,
    });

    toast.success("Password reset successfully!");
    navigate(routes.resetPasswordSuccess);
  } catch (error: any) {
    if (error.response?.status === 422) {
      // Laravel validation errors
      const errors: Record<string, string[]> = error.response.data.data;

      Object.values(errors).forEach((messages) => {
        messages.forEach((msgKey) => {
          const friendly =
            (enErrors as Record<string, string>)[msgKey] ?? msgKey;
          toast.error(friendly);
        });
      });
    } else {
      toast.error(enErrors["general_error"] ?? "Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5 mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column justify-content-between vh-100">
              <div className=" mx-auto p-4 text-center">
                <ImageWithBasePath
                  src="assets/img/logo.png"
                  className="img-fluid"
                  alt="Logo"
                  height={200}
                  width={200}
                />
              </div>
              <div className="card">
                <div className="card-body p-4 pb-3">
                  <h2 className="mb-2">Reset Password</h2>
                  <p>Enter a new password to log back in</p>

                  {/* New password */}
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="pass-group">
                      <input
                        type={visibility.newPassword ? "text" : "password"}
                        className="form-control"
                        value={passwords.newPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            newPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <span
                        className={`ti toggle-passwords ${
                          visibility.newPassword ? "ti-eye" : "ti-eye-off"
                        }`}
                        onClick={() => toggleVisibility("newPassword")}
                      ></span>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <div className="pass-group">
                      <input
                        type={visibility.confirmPassword ? "text" : "password"}
                        className="form-control"
                        value={passwords.confirmPassword}
                        onChange={(e) =>
                          setPasswords({
                            ...passwords,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <span
                        className={`ti toggle-passwords ${
                          visibility.confirmPassword ? "ti-eye" : "ti-eye-off"
                        }`}
                        onClick={() => toggleVisibility("confirmPassword")}
                      ></span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Changing..." : "Change Password"}
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
                <p className="mb-0">Copyright © 2025 - Cloud Notes</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
