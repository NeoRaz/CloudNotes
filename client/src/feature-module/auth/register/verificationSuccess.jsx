import React from 'react';
import { Button } from 'reactstrap';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import { useNavigate } from "react-router-dom";
import { auth_routes } from "../../router/all_routes";

const VerificationSuccess = () => {
  const routes = auth_routes;
  const navigation = useNavigate();

  return (
    <>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-5 mx-auto">
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
                                    <h2 className="mb-2">Verified!</h2>
                                    <p className="mb-0">
                                        Please proceed and login.
                                    </p>
                                </div>
                                <Button
                                    color="primary"
                                    className="btn btn-primary w-100"
                                    onClick={() => {
                                        localStorage.clear();
                                        sessionStorage.clear();
                                        navigation(routes.login);
                                    }}
                                >
                                    Sign In
                                </Button>{' '}
                            </div>
                        </div>
                        <div className="p-4 text-center">
                            <p className="mb-0">Copyright © 2025 - Cloud Notes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default VerificationSuccess;
