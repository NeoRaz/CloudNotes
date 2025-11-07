import React from 'react';
import { Button } from 'reactstrap';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { auth_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";

const Logout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleSubmitLogout = () => {
        queryClient.clear();

        sessionStorage.clear();
        localStorage.clear();
        navigate(auth_routes.login);
    };

    const cancelLogout = () => {
        navigate(-1);
    }

    return (

        <>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-5 mx-auto">
                <form className="form" onSubmit={handleSubmitLogout}>
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
                                    <h2 className="mb-2">You will be logged out!
                                    </h2>
                                    <p className="mb-0">
                                    Continue logging out?
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button
                                        color="secondary"
                                        className="rounded"
                                        onClick={cancelLogout}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        outline
                                        className="rounded"
                                        type="submit"
                                        data-cy="logout__confirmBtn"
                                    >
                                        Proceed
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 text-center">
                            <p className="mb-0 ">Copyright © 2025 - Cloud Notes</p>
                        </div>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </>
        
    );
};

export default Logout;
