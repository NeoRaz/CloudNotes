import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Modal from './Modal';
import Icon from '../../assets/icons/Icon';

const StatusModal = (props) => {
    const {
        isSuccess = false,
        title,
        message,
        closeModal,
        refresh,
        isError,
        isOpen,
    } = props;
    const [icon, setIcon] = useState('CloseCircle');

    const colorClassName = classNames({
        'text-danger': isError || isSuccess === false,
        'text-success': isSuccess,
    });

    useEffect(() => {
        if (isSuccess) {
            setIcon('ThumbUp');
        } else if (isError) {
            setIcon('Warning');
        } else {
            setIcon('CloseCircle');
        }
    }, []);

    const handleClose = () => {
        if (refresh) {
            window.location.reload();
        }
        closeModal();
    };

    const renderStatus = () => {
        if (isError) {
            return (
                <p className={`cash-balance-title ${colorClassName}`}>Error</p>
            );
        }
        return (
            <p className={`cash-balance-title ${colorClassName}`}>
                {isSuccess ? 'Successful' : 'Unsuccessful'}
            </p>
        );
    };

    return (
        <Modal
            toggle={handleClose}
            headerType="invest-withdrawal"
            onCancel={handleClose}
            cancelText="Close"
            title={title}
            isOpen={isOpen}
            testID="statusModal"
        >
            <div className="text-center" data-cy="modal__content">
                <Icon
                    icon={icon}
                    className={`modal__title-icon ${colorClassName}`}
                />
                {renderStatus()}
                <p>{message}</p>
            </div>
        </Modal>
    );
};

StatusModal.defaultProps = {
    refresh: true,
    isError: false,
};

export default StatusModal;
