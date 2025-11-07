import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import toast from 'react-hot-toast';
import { postSignUp } from './src/registrationApis';
import { Button } from 'reactstrap';
import CustomInputField from '../../../components/form/CustomInputField';
import Icon from '../../../components/Icon';
import { Field, withTypes } from 'react-final-form';
import Alert from '../../../components/notification/Alert';
import PasswordChecklist from '../../../components/PasswordChecklist';

const Register = () => {
  const routes = auth_routes;
  const navigation = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isErrorICEmail, setIsErrorICEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { Form } = withTypes();

  const signUpValidate = (values) => {
      const errors = {};
      if (!values.first_name) {
          errors.first_name = 'First Name is required';
      }
      if (!values.last_name) {
          errors.last_name = "Last Name is required";
      }
      if (!values.email) {
          errors.email = "Email is required";
      } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
          errors.email = "Email is not valid";
      }
      if (!values.password) {
          errors.password = "Password is required";
      } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*,.()\-+_={}[\]{};'\\:"|\\/<>?~`])(?=.{8})/.test(
              values.password
          )
      ) {
          errors.password = "Password field must contain minimum 8 characters | at least 1 uppercase and 1 lowercase | at least 1 number | at least 1 special character.";
      }
      if (!values.password_confirmation) {
          errors.password_confirmation = "Password confirmation is required";
      } else if (values.password_confirmation !== values.password) {
          errors.password_confirmation = "Password confirmation does not match";
      }
      return errors;
  };

  const handleSubmitResponse = (response) => {
      setIsLoading(false);
      localStorage.setItem('registration_id', response.id);
      localStorage.setItem('email', response.email);
      navigation(routes.verifyRegisteration);
  };

  const handleSubmitError = (error) => {
      setIsLoading(false);
      if (error.response?.status === 422) {
          setIsErrorICEmail(true);
      } else {
          toast.error(
              error.response?.data?.message ?? error.response?.data?.error,
              {
                  duration: 5000,
              }
          );
      }
  };

  const handleSubmit = async (values) => {
      try {
          setIsLoading(true);
          const response = await postSignUp(values);
          handleSubmitResponse(response);
      } catch (error) {
          handleSubmitError(error);
      }
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <Form
              initialValues={{
                  first_name: '',
                  last_name: '',
                  email: '',
                  password: '',
                  password_confirmation: '',
              }}
              validate={signUpValidate}
              onSubmit={(values) => {
                  handleSubmit(values);
              }}
            >
              {({ handleSubmit, values }) => (
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
                          <h2 className="mb-2">Register</h2>
                          <p className="mb-0">
                            Please enter your details to sign up
                          </p>
                        </div>
                        <div className="mt-4">
                          {isErrorICEmail && (
                              <div className="mb-3">
                                  <Alert color="danger" className="d-flex align-items-center">
                                      <p className="mb-0">
                                          Registration failed. Please check if you already have an account. Otherwise, please contact our support team at 
                                          <a href="mailto:isupport@mycloudnotes.com"> isupport@mycloudnotes.com</a>
                                      </p>
                                  </Alert>
                              </div>
                          )}

                          <div className="mb-3">
                              <Field name="first_name">
                                  {({ input, meta }) => (
                                      <CustomInputField
                                          input={input}
                                          meta={meta}
                                          type="text"
                                          placeholder="First Name *"
                                      />
                                  )}
                              </Field>
                          </div>

                          <div className="mb-3">
                              <Field name="last_name">
                                  {({ input, meta }) => (
                                      <CustomInputField
                                          input={input}
                                          meta={meta}
                                          type="text"
                                          placeholder="Last Name *"
                                      />
                                  )}
                              </Field>
                          </div>

                          <div className="mb-3">
                              <Field name="email">
                                  {({ input, meta }) => (
                                      <CustomInputField
                                          input={input}
                                          meta={meta}
                                          type="email"
                                          placeholder="Email *"
                                      />
                                  )}
                              </Field>
                          </div>

                          <div className="mb-3 position-relative">
                              <Field name="password">
                                  {({ input, meta }) => (
                                      <CustomInputField
                                          input={input}
                                          meta={meta}
                                          type={showPassword ? 'text' : 'password'}
                                          placeholder="Enter Password *"
                                      />
                                  )}
                              </Field>
                              <span
                                  className={`position-absolute top-50 end-0 translate-middle-y me-3 ${showPassword && 'active'}`}
                                  onClick={() => setShowPassword(!showPassword)}
                                  role="button"
                                  aria-hidden="true"
                                  tabIndex={0}
                              >
                                  <Icon icon={showPassword ? 'Eye' : 'EyeSlash'} />
                              </span>
                          </div>

                          <div className="mb-3 position-relative">
                              <Field name="password_confirmation">
                                  {({ input, meta }) => (
                                      <CustomInputField
                                          input={input}
                                          meta={meta}
                                          type={showRePassword ? 'text' : 'password'}
                                          placeholder="Re-enter Password *"
                                      />
                                  )}
                              </Field>
                              <span
                                  className={`position-absolute top-50 end-0 translate-middle-y me-3 ${showRePassword && 'active'}`}
                                  onClick={() => setShowRePassword(!showRePassword)}
                                  role="button"
                                  tabIndex={0}
                                  aria-hidden="true"
                              >
                                  <Icon icon={showRePassword ? 'Eye' : 'EyeSlash'} />
                              </span>
                          </div>

                          <div className="mb-3">
                              <PasswordChecklist
                                  password={values.password || ''}
                                  rePassword={values.password_confirmation || ''}
                              />
                          </div>

                        </div>
                        <div className="mb-3">
                          <Button
                            color="primary"
                            className="btn btn-primary w-100"
                            type="submit"
                            style={{ margin: '10px 0 20px 10px' }}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                            )}
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>{' '}
                        </div>
                        <div className="text-center">
                          <h6 className="fw-normal text-dark mb-0">
                            Already have an account?
                            <Link to={routes.login} className="hover-a ">
                              {" "}
                              Sign In
                            </Link>
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <p className="mb-0 ">Copyright © 2025 - Cloud Notes</p>
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

export default Register;
