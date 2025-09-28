import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import { getUserDetails, postResetUserPassword, postEditUserDetails } from "./src/profileApis";
import toast from "react-hot-toast";

type PasswordField = "newPassword" | "confirmPassword";

const Profile = () => {
  const route = all_routes;
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  // User profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Load user details on mount
    getUserDetails()
      .then((res: any) => {
        setFirstName(res.data.user.first_name || "");
        setLastName(res.data.user.last_name || "");
        setEmail(res.data.user.email || "");
      })
      .catch(() => toast.error("Failed to load user details"));
  }, []);

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSaveDetails = () => {
    postEditUserDetails({ first_name: firstName, last_name: lastName })
      .then(() => toast.success("Profile updated successfully"))
      .catch(() => toast.error("Failed to update profile"));
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    postResetUserPassword({ new_password: newPassword, new_password_confirmation: confirmPassword })
      .then(() => toast.success("Password changed successfully"))
      .catch(() => toast.error("Failed to change password"));
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-md-flex d-block align-items-center justify-content-between border-bottom pb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Profile</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={route.noteList}>Notes</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Profile
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="d-md-flex d-block mt-3">
            <div className="flex-fill ps-0 border-0">
              <form>
                <div className="d-md-flex">
                  <div className="flex-fill">
                    {/* Personal Info Card */}
                    <div className="card">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5>Personal Information</h5>
                        <button
                          type="button"
                          onClick={handleSaveDetails}
                          className="btn btn-primary btn-sm"
                        >
                          Save
                        </button>
                      </div>
                      <div className="card-body pb-0">
                        <div className="d-block d-xl-flex">
                          <div className="mb-3 flex-fill me-xl-3 me-0">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                          <div className="mb-3 flex-fill">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            value={email}
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    {/* Password Card */}
                    <div className="card mt-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h5>Password</h5>
                        <button
                          type="button"
                          onClick={handleChangePassword}
                          className="btn btn-primary btn-sm"
                        >
                          Save
                        </button>
                      </div>
                      <div className="card-body pb-0">
                        <div className="mb-3">
                          <label className="form-label">New Password</label>
                          <div className="pass-group d-flex">
                            <input
                              type={passwordVisibility.newPassword ? "text" : "password"}
                              className="pass-input form-control"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <span
                              className={`ti toggle-passwords ${
                                passwordVisibility.newPassword ? "ti-eye" : "ti-eye-off"
                              }`}
                              onClick={() => togglePasswordVisibility("newPassword")}
                            ></span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Confirm Password</label>
                          <div className="pass-group d-flex">
                            <input
                              type={passwordVisibility.confirmPassword ? "text" : "password"}
                              className="pass-input form-control"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span
                              className={`ti toggle-passwords ${
                                passwordVisibility.confirmPassword ? "ti-eye" : "ti-eye-off"
                              }`}
                              onClick={() => togglePasswordVisibility("confirmPassword")}
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End Password Card */}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
