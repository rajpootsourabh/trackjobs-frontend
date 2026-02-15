import React from 'react';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import PasswordField from '../../../../components/common/form/PasswordField';
import { resetPasswordSchema } from '../../schemas/validationSchemas';

const ResetPasswordForm = ({
    onSubmit,
    isSubmitted,
    successMessage,
    onGoToLogin,
    isSubmitting,
    token,
    email
}) => {
    if (isSubmitted && successMessage) {
        return (
            <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {successMessage}
                </div>
                <Button
                    type="button"
                    variant="primary"
                    size="large"
                    className="w-[181px] h-[43px] mx-auto block"
                    onClick={onGoToLogin}
                >
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <Formik
            initialValues={{
                password: '',
                password_confirmation: ''
            }}
            validationSchema={resetPasswordSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting: formikSubmitting, status }) => (
                <Form className="space-y-4">
                    <p className="text-gray-600 text-sm text-center mb-4">
                        Enter your new password below.
                    </p>

                    {(!token || !email) && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            Invalid password reset link. Please request a new one.
                        </div>
                    )}

                    {status?.apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {status.apiError}
                        </div>
                    )}

                    <PasswordField
                        name="password"
                        label="New Password"
                        placeholder="Enter your new password"
                        disabled={!token || !email}
                    />

                    <PasswordField
                        name="password_confirmation"
                        label="Confirm New Password"
                        placeholder="Confirm your new password"
                        disabled={!token || !email}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        align="center"
                        loading={isSubmitting || formikSubmitting}
                        sx={{ width: 210, height: 43 }}
                        disabled={isSubmitting || formikSubmitting || !token || !email}
                    >
                        Reset Password
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default ResetPasswordForm;