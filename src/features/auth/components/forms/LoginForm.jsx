import React from 'react';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import Button from '../../../../components/common/Button';
import DebouncedTextField from '../../../../components/common/form/DebouncedTextField';
import PasswordField from '../../../../components/common/form/PasswordField';
import { loginSchema } from '../../schemas/validationSchemas';

const LoginForm = ({ onSubmit, initialValues, isSubmitting, status, showSuccessMessage }) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={onSubmit}
        >
            {({ values, errors, touched, setFieldValue, setFieldTouched }) => (
                <Form className="space-y-4">
                    {showSuccessMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {showSuccessMessage}
                        </div>
                    )}

                    {status?.apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                            {status.apiError}
                        </div>
                    )}

                    <DebouncedTextField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={(value) => setFieldValue('email', value)}
                        onBlur={() => setFieldTouched('email', true)}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />

                    <PasswordField
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                    />

                    <div className="flex justify-end mb-4">
                        <Link
                            to="/forgot-password"
                            className="text-primary-800 hover:text-primary-600 hover:underline text-sm font-poppins"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        align="center"
                        loading={isSubmitting}
                        sx={{ width: 181, height: 43 }}
                    >
                        Login
                    </Button>

                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;