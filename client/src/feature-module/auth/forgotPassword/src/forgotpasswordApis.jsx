import { postRequest } from '../../../../api/api';
import toast from 'react-hot-toast';

const notifyError = (message) => {
    toast.error(message, {
        duration: 5000,
    });
};

export function postResetPasswordEmail(values) {
    return new Promise((resolve, reject) => {
        try {
            postRequest(
                '/send-reset-password-email',
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

