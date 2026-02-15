// features/clients/components/ClientForm/NewClientForm.jsx
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Paper } from '@mui/material';
import ClientTypeSelector from './ClientTypeSelector';
import CommercialClientForm from './CommercialClientForm';
import ResidentialClientForm from './ResidentialClientForm';
import AvailabilitySchedule from './AvailabilitySchedule';
import FormActions from './FormActions';
import { clientValidationSchema } from '../../schemas/clientValidationSchemas';
import { INITIAL_CLIENT_VALUES } from '../../constants/clientConstants';

const NewClientForm = ({
  onSubmit,
  onCancel,
  onSaveAndCreateQuote,
  initialData = {},
  isLoading = false
}) => {
  // Determine mode based on whether we have initial data with an id
  const mode = initialData?.id ? 'update' : 'create';
  const [clientType, setClientType] = useState(initialData.client_type || 'commercial');
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    console.log('isLoading changed:', isLoading);
  }, [isLoading]);
  
  // Merge initial values with client_type
  const mergedInitialValues = {
    ...INITIAL_CLIENT_VALUES,
    client_type: clientType, // Add client_type to form values
    ...initialData,
  };

  // Unified submit handler that handles both actions
  const handleFormSubmit = async (values, formikHelpers) => {
    const { setSubmitting, validateForm } = formikHelpers;
    
    // Get the action from the values (set by the button click)
    const action = values._action || 'save';
    
    // Remove the temporary _action field
    const { _action, ...submitValues } = values;

    // Validate form first
    const errors = await validateForm(submitValues);
    if (Object.keys(errors).length > 0) {
      // If there are validation errors, don't submit
      setSubmitting(false);
      setLoadingAction(null);
      return;
    }

    console.log("========== FORM SUBMISSION PAYLOAD ==========");
    console.log("Form values:", submitValues);
    console.log("Client Type:", submitValues.client_type);
    console.log("Action:", action);
    console.log("JSON Stringified:", JSON.stringify(submitValues, null, 2));
    console.log("==============================================");

    setLoadingAction(action);
    try {
      if (action === 'saveAndCreate' && onSaveAndCreateQuote) {
        await onSaveAndCreateQuote(submitValues);
      } else {
        await onSubmit(submitValues);
      }
    } finally {
      setLoadingAction(null);
      setSubmitting(false);
    }
  };

  // Update form values when clientType changes
  useEffect(() => {
    // You could update formik values here if needed
  }, [clientType]);

  return (
    <Formik
      initialValues={mergedInitialValues}
      validationSchema={clientValidationSchema(clientType)}
      onSubmit={handleFormSubmit}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={true}
      validate={(values) => {
        // This will run on every change
        console.log("🔄 Validating values:", values);
        try {
          const schema = clientValidationSchema(clientType);
          schema.validateSync(values, { abortEarly: false });
          console.log("✅ Validation passed");
          return {};
        } catch (err) {
          const errors = {};
          err.inner.forEach((error) => {
            errors[error.path] = error.message;
            console.log(`❌ Field ${error.path}: ${error.message}`);
          });
          return errors;
        }
      }}
    >
      {(formikProps) => (
        <Form>
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <ClientTypeSelector
              clientType={clientType}
              onChange={setClientType}
              formik={formikProps}
              mode={mode}
            />

            {clientType === 'commercial' ? (
              <CommercialClientForm
                formik={formikProps}
                mode={mode}  // Pass mode here
              />
            ) : (
              <ResidentialClientForm
                formik={formikProps}
                mode={mode}
              />
            )}

            <AvailabilitySchedule
              formik={formikProps}
              mode={mode}
              sectionNumber={clientType === 'commercial' ? '6' : '4'}  // Commercial has 5 sections, Residential has 3
            />

            <FormActions
              onCancel={onCancel}
              isLoading={isLoading || loadingAction !== null}
              loadingAction={loadingAction}
              onSave={() => {
                // Set action to 'save' and submit
                formikProps.setFieldValue('_action', 'save');
                formikProps.submitForm();
              }}
              onSaveAndCreateQuote={() => {
                // Set action to 'saveAndCreate' and submit
                formikProps.setFieldValue('_action', 'saveAndCreate');
                formikProps.submitForm();
              }}
            />
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default NewClientForm;