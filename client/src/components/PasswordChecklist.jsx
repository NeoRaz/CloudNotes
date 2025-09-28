import React, { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';

const ChecklistItem = ({ label, meetsReq }) => {
    return (
        <div
            className={`d-flex align-items-center checklist__item ${
                meetsReq ? 'text-success' : 'text-danger'
            }`}
        >
            {meetsReq ? (
                <Icon icon="Check" width={15} className="me-2" />
            ) : (
                <Icon icon="Close" width={15} className="me-2" />
            )}
            <span>{label}</span>
        </div>
    );
};

const PasswordChecklist = ({ password, rePassword }) => {
    const [contains8C, setContains8C] = useState(false);
    const [containsUL, setContainsUL] = useState(false);
    const [containsLL, setContainsLL] = useState(false);
    const [containsN, setContainsN] = useState(false);
    const [containsSC, setContainsSC] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);

    const validatePassword = useCallback(() => {
        setContainsUL(password.toLowerCase() !== password); // Checks for uppercase letters
        setContainsLL(password.toUpperCase() !== password); // Checks for lowercase letters
        setContainsN(/\d/.test(password)); // Checks for numbers
        setContainsSC(
            /[!@#$%^&*,.()\-+_={}[\]{};'\\:"|\\/<>?~`]/g.test(password)
        ); // Checks for special characters
        setContains8C(password.length >= 8); // Checks for minimum length
        setPasswordMatch(password !== '' && password === rePassword); // Checks if passwords match
    }, [password, rePassword]);

    const checklists = [
        ['Minimum 8 characters', contains8C],
        ['At least 1 uppercase letter', containsUL],
        ['At least 1 lowercase letter', containsLL],
        ['At least 1 number', containsN],
        ['At least 1 special character', containsSC],
        ['Passwords match', passwordMatch],
    ];

    useEffect(() => {
        validatePassword();
    }, [validatePassword]);

    return (
        <div className="checklist__container">
            <span className="checklist__title">Password Requirements:</span>
            {checklists.map(([label, meetsReq], index) => (
                <ChecklistItem label={label} meetsReq={meetsReq} key={index} />
            ))}
        </div>
    );
};

export default PasswordChecklist;
