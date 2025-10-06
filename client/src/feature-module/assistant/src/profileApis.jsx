import { getRequest, postRequest } from '../../../api/api';
import toast from 'react-hot-toast';

const notifyError = (message) => {
    toast.error(message, { duration: 5000 });
};

export function getUserDetails() {
    return new Promise((resolve, reject) => {
        try {
            getRequest(
                '/user/details',
                 {},
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

export function postResetUserPassword(values) {
    return new Promise((resolve, reject) => {
        try {
            postRequest(
                '/user/reset-password',
                 {},
                values,
                (response) => resolve(response)
            ).catch((error) => reject(error));
        } catch (error) {
            notifyError(error.message);
            reject(error);
        }
    });
}

export function postEditUserDetails(values) {
    return new Promise((resolve, reject) => {
        try {
            postRequest(
                '/user/edit-details',
                 {},
                values,
                (response) => resolve(response)
            ).catch((error) => reject(error));
        } catch (error) {
            notifyError(error.message);
            reject(error);
        }
    });
}
