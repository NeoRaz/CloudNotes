import React from 'react';
import { Modal, ButtonToolbar, Button } from 'reactstrap';
import Icon from '../../assets/icons/Icon';

const SuccessModal = ({ isOpen, toggle, title, message }) => (
    <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="modal-dialog--primary modal-dialog--header theme-light"
        style={{ marginTop: '0px !important' }}
    >
        <div
            className="modal__header topupwithdrawal-amount-header"
            data-cy="modal__header"
        >
            <h4 className="bold-text  modal__title">{title}</h4>
        </div>
        <div
            className="modal__body"
            style={{ textAlign: 'center' }}
            data-cy="modal__content"
        >
            <Icon icon="ThumbUp" className="modal__title-icon" />
            <p className="cash-balance-title">Successful</p>
            <p className="mb-1">{message}</p>
            <ButtonToolbar className="modal__footer">
                <Button
                    className="btn btn_uni rounded"
                    color="primary"
                    onClick={toggle}
                    data-cy="modal__closeBtn"
                >
                    Close
                </Button>
            </ButtonToolbar>
        </div>
    </Modal>
);

export default SuccessModal;
