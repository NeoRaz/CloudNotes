import { postRequest } from '../../../../api/api';
import toast from 'react-hot-toast';

const notifyError = (message) => {
    toast.error(message, {
        duration: 5000,
    });
};


export function postResetPassword(values) {
    return new Promise((resolve, reject) => {
        try {
            postRequest(
                '/reset-password',
                null,
                values,
                (response) => {
                    resolve(response);
                }
            ).catch((error) => {
                reject(error);
            });
        } catch (error) {
            notifyError(error.message);
            reject(error);
        }
    });
}

export function checkTokenValidity(values) {
    return new Promise((resolve, reject) => {
        try {
            postRequest(
                "/check-password-token-validity", 
                null, 
                values, 
                (response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
            });

        } catch (error) {
            notifyError(error.message);
            reject(error);
        }
    });
}

