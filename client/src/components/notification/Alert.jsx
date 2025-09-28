import React, { useEffect, useState } from 'react';
import { Alert } from 'reactstrap';
import Icon from '../Icon';

const AlertComponent = (props) => {
    const { color, className, icon, children } = props;
    const [iconName, setIconName] = useState('Infomation');

    useEffect(() => {
        switch (color) {
            case 'info':
                setIconName('Infomation');
                break;
            case 'success':
                setIconName('ThumbUp');
                break;
            case 'warning':
                setIconName('CommentAlert');
                break;
            case 'danger':
                setIconName('CloseCircle');
                break;
            default:
                break;
        }
    }, [color]);

    return (
        <Alert
            color={color}
            className={`width-hundred ${className}`}
            isOpen
            data-cy={`alert--${color}`}
        >
            {icon && (
                <div className="alert__icon">
                    <Icon icon={iconName} width="24" />
                </div>
            )}
            <div className="alert__content">{children}</div>
        </Alert>
    );
};

AlertComponent.defaultProps = {
    color: '',
    icon: false,
    className: '',
};

export default AlertComponent;
