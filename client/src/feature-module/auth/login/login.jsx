import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth_routes, all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { Field, withTypes } from 'react-final-form';
import { postLogin } from './src/authApis';
import { aesEncrypt } from '../../../utils/crypto';
import { Button } from 'reactstrap';
import CustomInputField from '../../../components/form/CustomInputField';
import Icon from '../../../components/Icon';

const Login = () => {
  const routes = all_routes;
  const authRoutes = auth_routes;
  const navigation = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // ⬅️ track loading state

  const showPassword = (e) => {
      e.preventDefault();
      setIsShowPassword(!isShowPassword);
  };

  const { Form } = withTypes();

  const loginValidation = (values) => {
    const errors = {};
    if (!values.username) {
        errors.username = "Email field should not be empty.";
    }
    if (!values.password) {
        errors.password = "Password field should not be empty.";
    }
    return errors;
}

const handleLoginResponse = (response) => {
  setIsAuthenticated(true);
  setIsLoading(false);
  sessionStorage.removeItem('login_token');

  sessionStorage.setItem('token_type', response.token_type);
  sessionStorage.setItem('access_token', response.access_token);
  sessionStorage.setItem('refresh_token', aesEncrypt(response.refresh_token));
  sessionStorage.setItem('username', response.username);

  navigation(routes.noteList);
}

const handleLoginError = (error) => {
  console.error('Login failed', error);
  setIsLoading(false);
  // Handle login error here (e.g., show error message)
}

const handleSubmit = async (values) => {
  try {
      setIsLoading(true);
      const response = await postLogin(values);
      handleLoginResponse(response);
  } catch (error) {
      handleLoginError(error);
  }
}


  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 mx-auto">
           
          <Form
                initialValues={{
                    username: '',
                    password: '',
                }}
                validate={loginValidation}
                onSubmit={(values) => { handleSubmit(values) }}
            >
                {({ handleSubmit }) => (
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
                        <div className="card-body p-4">
                          <div className=" mb-4">
                            <h2 className="mb-2">Welcome</h2>
                            <p className="mb-0">
                              Please enter your details to sign in
                            </p>
                          </div>
                          <div className="mb-3 ">
                          <Field name="username">
                              {({ input, meta }) => (
                                  <CustomInputField
                                      input={input}
                                      meta={meta}
                                      type="email"
                                      placeholder="Email"
                                  />
                              )}
                          </Field>

                          <div className="mb-3 position-relative">
                            <Field name="password">
                                {({ input, meta }) => (
                                    <CustomInputField
                                        input={input}
                                        meta={meta}
                                        type={isShowPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        data-cy="login__password"
                                    />
                                )}
                            </Field>
                            <span
                                className={`position-absolute top-50 end-0 translate-middle-y me-3 ${isShowPassword ? 'active' : ''}`}
                                onClick={showPassword}
                                onKeyDown={showPassword}
                                role="button"
                                tabIndex={0}
                                style={{ cursor: 'pointer' }}
                            >
                                <Icon icon={isShowPassword ? 'Eye' : 'EyeSlash'} />
                            </span>
                        </div>
                          </div>
                          <div className="form-wrap form-wrap-checkbox mb-3">
                            {/* <div className="d-flex align-items-center">
                              <div className="form-check form-check-md mb-0">
                                <input
                                  className="form-check-input mt-0"
                                  type="checkbox"
                                />
                              </div>
                              <p className="ms-1 mb-0 ">Remember Me</p>
                            </div> */}
                            <div className="text-end ">
                              <Link to={authRoutes.forgotPassword} className="link-danger">
                                Forgot Password?
                              </Link>
                            </div>
                          </div>
                          <div className="mb-3">
                            <Button
                                color="primary"
                                className="btn btn-primary w-100"
                                type="submit"
                                disabled={isLoading}
                            >
                              {isLoading && (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                              )}
                              {isLoading ? "Signing In..." : "Sign In"}
                            </Button>{' '}
                          </div>
                          <div className="text-center">
                            <h6 className="fw-normal text-dark mb-0">
                              Don’t have an account?{" "}
                              <Link to={authRoutes.register} className="hover-a ">
                                {" "}
                                Create Account
                              </Link>
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <p className="mb-0 ">Copyright © 2024 - Cloud Notes</p>
                      </div>
                    </div>
                  </form>
            )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
