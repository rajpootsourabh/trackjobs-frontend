import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { Paper } from "@mui/material";
import BasicInformation from "./BasicInformation";
import ContactDetails from "./ContactDetails";
import OfficialDetails from "./OfficialDetails";
import FormActions from "./FormActions";
import { employeeValidationSchema } from "../../schemas/employeeValidationSchemas";
import { INITIAL_EMPLOYEE_VALUES } from "../../constants/employeeConstants";

const EmployeeForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  isLoading = false,
}) => {
  const mode = initialData?.id ? "update" : "create";
  const [loadingAction, setLoadingAction] = useState(null);

  // Merge initial values
  const mergedInitialValues = {
    ...INITIAL_EMPLOYEE_VALUES,
    ...initialData,
  };

  const handleFormSubmit = async (values, formikHelpers) => {
    const { setSubmitting, validateForm } = formikHelpers;

    // Validate form first
    const errors = await validateForm(values);
    if (Object.keys(errors).length > 0) {
      setSubmitting(false);
      setLoadingAction(null);
      return;
    }

    console.log("========== FORM SUBMISSION PAYLOAD ==========");
    console.log("Form values:", values);
    console.log("Mode:", mode);
    console.log("==============================================");

    setLoadingAction("save");
    try {
      await onSubmit(values);
    } finally {
      setLoadingAction(null);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={mergedInitialValues}
      validationSchema={employeeValidationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(formikProps) => (
        <Form>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <BasicInformation formik={formikProps} />
            
            <ContactDetails formik={formikProps} />
            
            <OfficialDetails formik={formikProps} />

            <FormActions
              formik={formikProps}
              onCancel={onCancel}
              isLoading={isLoading || loadingAction !== null}
            />
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default EmployeeForm;