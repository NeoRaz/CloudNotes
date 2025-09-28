import { postRequest } from '../../../../api/api';
import toast from 'react-hot-toast';

const notifyError = (message) => {
    toast.error(message, {
        duration: 5000,
    });
};

const client_id_secret = {
    client_id: process.env.REACT_APP_CLIENT_ID,
    client_secret: process.env.REACT_APP_CLIENT_SECRET,
}

export function postResetPassword(values) {
    return new Promise((resolve, reject) => {
        try {
            const requestData = {
                grant_type: 'password',
                ...client_id_secret,
                ...values,
            };

            postRequest(
                '/api/reset-password',
                null,
                requestData,
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
