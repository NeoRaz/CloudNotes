import React from 'react';
import MaskedInput from 'react-text-mask';

const CustomInputField = (props) => {
    const {
        input,
        placeholder,
        type,
        mask,
        meta: { touched, error },
        submitted,
        style,
        autoFocus,
        'data-cy': dataCy,
        inputClassName,
        className,
    } = props;

    const inputClass = `form-control ${inputClassName}`;

    if (mask) {
        return (
            <div className={`mb-3 ${className}`}>
                <MaskedInput
                    {...input}
                    placeholder={placeholder}
                    type={type}
                    mask={mask}
                    disabled={submitted}
                    data-cy={dataCy}
                    className={inputClass}
                />
                {touched && error && (
                    <div
                        className="invalid-feedback d-block"
                        data-cy={`${dataCy}--error`}
                    >
                        {error}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`mb-3 ${className}`}>
            <input
                {...input}
                placeholder={placeholder}
                type={type}
                style={style}
                disabled={submitted}
                autoFocus={autoFocus}
                data-cy={dataCy}
                className={inputClass}
            />
            {touched && error && (
                <div
                    className="invalid-feedback d-block"
                    data-cy={`${dataCy}--error`}
                >
                    {error}
                </div>
            )}
        </div>
    );
};

export default CustomInputField;
