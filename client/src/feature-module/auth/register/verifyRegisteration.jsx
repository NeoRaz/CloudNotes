import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth_routes } from '../../router/all_routes';
import { postSubmitVerifyRegistration } from './src/registrationApis';
import VerificationCode from './verificationCode';
import { Card, Col, Row, Container } from 'reactstrap';

const VerifyRegistration = () => {
    const routes = auth_routes;
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        const registrationId = localStorage.getItem('registration_id');
        if (!registrationId) {
            navigate(routes.register);
        }
    }, [navigate]);

    const handleSubmitVerifyRegistration = (response) => {
        localStorage.removeItem('registration_id');
        localStorage.removeItem('email');
        localStorage.removeItem('identification_type_id');
        navigate(routes.verificationSuccess);
    };

    const handleVerifyError = (error) => {
        console.error('Verification failed', error);
        // Handle verification error here (e.g., show error message)
    };

    const handleVerify = async (values) => {
        try {
            const response = await postSubmitVerifyRegistration(values);
            handleSubmitVerifyRegistration(response);
        } catch (error) {
            handleVerifyError(error);
        }
    };

    return (
        <VerificationCode onSubmit={handleVerify} />
    );
};

export default VerifyRegistration;
