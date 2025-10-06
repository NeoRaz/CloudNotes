import React, { useState } from "react";
import { Field, withTypes } from 'react-final-form';
import { Button } from 'reactstrap';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import CustomInputField from '../../../components/form/CustomInputField';
import Alert from '../../../components/notification/Alert';
import Timer from '../../../components/Timer';

const VerificationCode = (props) => {
  const {
    onSubmit,
    errorVerification,
    isOTPResendSuccess,
    OTPResendCount,
  } = props;

  const [isLoading, setIsLoading] = useState(false);

  const onCountdownToZero = () => {
    // Toggle OTP resend states here if necessary.
  };

  const cooldownTime = 300;
  const maxResendCount = 5;

  const verifyValidate = (values) => {
    const errors = {};
    if (!values.code) {
      errors.code = '6-digits verification code is required.';
    }
    return errors;
  };

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    try {
      await onSubmit(values); // call parent submit
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const { Form } = withTypes();

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 mx-auto">
            <Form
              initialValues={{ code: '' }}
              validate={verifyValidate}
              onSubmit={handleFormSubmit}
            >
              {({ handleSubmit }) => (
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
                          <h2 className="mb-2">Verify Your Email</h2>
                          <p className="mb-0">
                            A 6-digit verification code has been sent to{' '}
                            <strong>{localStorage.getItem('email')}</strong>
                          </p>
                        </div>

                        {errorVerification && (
                          <Alert color="danger" className="alert--colored" icon>
                            <p className="mb-0">
                              <strong className="text-danger">
                                Invalid verification code!
                              </strong>{' '}
                              Please insert a valid 6-digit code.
                            </p>
                          </Alert>
                        )}

                        <div className="mb-3">
                          <Field name="code">
                            {({ input, meta }) => (
                              <CustomInputField
                                input={input}
                                meta={meta}
                                mask={[
                                  /\d/, /\d/, /\d/, /\d/, /\d/, /\d/
                                ]}
                                placeholder="Enter OTP"
                                type="text"
                              />
                            )}
                          </Field>
                        </div>

                        <div className="mb-3">
                          <Timer
                            cooldownTime={cooldownTime}
                            maxResendCount={maxResendCount}
                            onCountdownToZero={onCountdownToZero}
                            conditionToStartTimer={isOTPResendSuccess}
                            currentResendCount={OTPResendCount}
                          />
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
                            {isLoading ? "Verifying..." : "Verify"}
                          </Button>
                        </div>

                      </div>
                    </div>

                    <div className="p-4 text-center">
                      <p className="mb-0">Copyright © 2024 - Cloud Notesfy</p>
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

export default VerificationCode;
