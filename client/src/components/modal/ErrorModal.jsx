import React from 'react';
import { Modal, ButtonToolbar, Button } from 'reactstrap';
import Icon from '../../assets/icons/Icon';

const ErrorModal = ({ isOpen, toggle, title, message }) => (
    <Modal
        isOpen={isOpen}
        className="modal-dialog--primary modal-dialog--header theme-light margin-top-0"
    >
        <div className="modal__header topupwithdrawal-amount-header">
            <h4 className="bold-text  modal__title">{title}</h4>
        </div>
        <div className="modal__body text-center">
            <Icon icon="CloseCircle" className="modal__title-icon" />
            <p className="cash-balance-title">Unsuccessful!</p>
            <p>{message}</p>
            <ButtonToolbar className="modal__footer ">
                <Button
                    className="btn btn_uni rounded"
                    color="primary"
                    onClick={toggle}
                >
                    Close
                </Button>
            </ButtonToolbar>
        </div>
    </Modal>
);

export default ErrorModal;
