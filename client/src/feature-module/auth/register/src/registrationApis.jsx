import { postRequest } from '../../../../api/api';

export function postSignUp(values) {
    return new Promise((resolve, reject) => {
        const requestData = { ...values };

        postRequest(
            'api/v1/register/account-setup',
            null,
            requestData,
            (response) => {
                resolve(response);
            }
        ).catch((error) => {
            reject(error); // Propagate error to be handled by the caller
        });
    });
}

export function postSubmitVerifyRegistration(values) {
    return new Promise((resolve, reject) => {
        const requestData = {
            ...values,
            registration_id: localStorage.getItem('registration_id')
        };

        postRequest(
            'api/v1/register/verify-registration',
            null,
            requestData,
            (response) => {
                resolve(response);
            }
        ).catch((error) => {
            reject(error);
        });
    });
}