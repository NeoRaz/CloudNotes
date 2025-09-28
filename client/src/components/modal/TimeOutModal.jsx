import React from 'react';
import Modal from './Modal';

const TimeOutModal = ({ isOpen }) => {

    const handleClose = () => {
        window.location.reload();
    };
    return (
        <Modal
            toggle={handleClose}
            isOpen={isOpen}
            onCancel={handleClose}
            cancelText="Close"
            headerType="Example"
            title="Session Timeout"
        >
            <div>
                <span className="font-size-12">
                    "Your connection has timed out. Please log in again to continue!"
                </span>
            </div>
        </Modal>
    );
};

export default TimeOutModal;
