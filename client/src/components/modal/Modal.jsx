import {
    Modal as RSModal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ButtonToolbar,
    Button,
} from 'reactstrap';

const Modal = (props) => {
    const {
        children,
        isOpen,
        toggle,
        headerType,
        submitShown = false,
        title = 'Title',
        submitText = 'Submit',
        cancelText = 'Cancel',
        onCancel = () => null,
        onSubmit = () => null,
        testID,
        submitBtnProps = {},
        size = 'sm',
        backdrop = true,
        bodyClassName,
    } = props;

    const getHeaderBackground = () => {
        switch (headerType) {
            case 'review': {
                return 'review-header';
            }
            case 'review-2': {
                return 'review-header-new';
            }
            case 'invest': {
                return 'invest-amount-header';
            }
            case 'invest-withdrawal': {
                return 'investwithdrawal-amount-header';
            }
            case 'auto-invest': {
                return 'autoinvest-amount-header';
            }
            case 'comment': {
                return 'comment-header';
            }
            case 'change-phone': {
                return 'change-phone-number-header';
            }
            default: {
                return 'default-header';
            }
        }
    };

    return (
        <RSModal
            isOpen={isOpen}
            toggle={toggle}
            backdrop={backdrop}
            // data-testid={genTestId('modal', testID)}
            className="theme-light"
            size={size}
        >
            <ModalHeader
                className={`${getHeaderBackground()}`}
                data-cy="modal__header"
            >
                {title}
            </ModalHeader>
            <ModalBody className={bodyClassName}>{children}</ModalBody>
            <ModalFooter>
                <ButtonToolbar className="flex-fill justify-content-center">
                    <Button
                        className={`
            rounded mb-0 flex-grow-1`}
                        color="primary"
                        type="button"
                        outline={submitShown}
                        style={{ boxSizing: 'border-box', maxWidth: '180px' }}
                        onClick={onCancel}
                        // data-testid={genTestId('cancel-button', testID)}
                    >
                        {cancelText}
                    </Button>
                    {submitShown && (
                        <Button
                            className="rounded mb-0 flex-grow-1"
                            color="primary"
                            type="submit"
                            onClick={onSubmit}
                            // data-testid={genTestId('submit-button', testID)}
                            {...submitBtnProps}
                        >
                            {submitText}
                        </Button>
                    )}
                </ButtonToolbar>
            </ModalFooter>
        </RSModal>
    );
};

export default Modal;
