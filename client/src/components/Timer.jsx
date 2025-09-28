import React, { useEffect, useState } from 'react';

const Timer = (props) => {
    const {
        cooldownTime,
        maxResendCount,
        onCountdownToZero,
        conditionToStartTimer,
        currentResendCount,
    } = props;

    const [resendCooldown, setResendCooldown] = useState(cooldownTime);

    // UseEffect for timer logic
    useEffect(() => {
        if (resendCooldown === 0) {
            setResendCooldown(cooldownTime);
            onCountdownToZero();
        } else if (conditionToStartTimer && resendCooldown > 0) {
            const cooldown = setTimeout(() => {
                setResendCooldown(
                    (resendCooldownPrev) => resendCooldownPrev - 1
                );
            }, 1000);
            return () => clearTimeout(cooldown);
        }
    }, [
        conditionToStartTimer,
        cooldownTime,
        onCountdownToZero,
        resendCooldown,
    ]);

    if (!conditionToStartTimer) {
        return null;
    }

    return (
        <div className="text-muted small">
            {currentResendCount < maxResendCount ? (
                <span>
                    Request a new one in{' '}
                    <strong className="text-primary">
                        {`${resendCooldown} second${
                            resendCooldown % 60 > 1 ? 's' : ''
                        }`}
                    </strong>
                </span>
            ) : (
                <span className="text-danger">
                    Request limit exceeded. Maximum attempts: {maxResendCount}.
                </span>
            )}
        </div>
    );
};

export default Timer;
