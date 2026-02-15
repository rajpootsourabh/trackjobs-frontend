import React from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../../components/common/Button';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import { forgotPasswordSchema } from '../../schemas/validationSchemas';

const ForgotPasswordForm = ({
    onSubmit,
    isSubmitted,
    successMessage,
    onResend,
    isSubmitting
}) => {
    if (isSubmitted && successMessage) {
        return (
            <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {successMessage}
                </div>
                <p className="text-gray-600 text-sm text-center">
                    Didn't receive the email? Check your spam folder or try again.
                </p>
                <Button
                    type="button"
                    variant="primary"
                    size="large"
                    className="w-[181px] h-[43px] mx-auto block"
                    onClick={onResend}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={onSubmit}
        >
            {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting: formikSubmitting, status }) => (
                <Form className="space-y-4">
                    <p className="text-gray-600 text-sm text-center mb-4">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {status?.apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {status.apiError}
                        </div>
                    )}

                    <DebouncedTextField
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Enter your email address"
                        value={values.email}
                        onChange={(value) => setFieldValue('email', value)}
                        onBlur={() => setFieldTouched('email', true)}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    // Optional: Add debounce delay (default is 300ms)
                    // delay={500}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        align="center"
                        loading={isSubmitting || formikSubmitting}
                        sx={{ width: 200, height: 43 }}
                    >
                        Send Reset Link
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default ForgotPasswordForm;