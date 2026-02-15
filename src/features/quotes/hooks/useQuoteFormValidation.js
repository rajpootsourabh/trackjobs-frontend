// features/quotes/hooks/useQuoteFormValidation.js
import { useState, useEffect } from 'react';

export const useQuoteFormValidation = (formik) => {
  const [validationSummary, setValidationSummary] = useState([]);

  useEffect(() => {
    // Generate a summary of validation errors for toast notifications
    const errors = formik.errors;
    const touched = formik.touched;
    
    if (Object.keys(errors).length > 0) {
      const summary = [];
      
      // Quote Details errors
      if (errors.title && touched.title) {
        summary.push({ field: 'title', message: errors.title });
      }
      if (errors.client_id && touched.client_id) {
        summary.push({ field: 'client', message: errors.client_id });
      }
      if (errors.currency && touched.currency) {
        summary.push({ field: 'currency', message: errors.currency });
      }
      if (errors.expires_at && touched.expires_at) {
        summary.push({ field: 'expiry', message: errors.expires_at });
      }
      if (errors.client_email && touched.client_email) {
        summary.push({ field: 'email', message: errors.client_email });
      }
      
      // Line items errors
      if (errors.line_items) {
        if (typeof errors.line_items === 'string') {
          summary.push({ field: 'line_items', message: errors.line_items });
        } else if (Array.isArray(errors.line_items)) {
          errors.line_items.forEach((itemError, index) => {
            if (itemError?.item_name) {
              summary.push({ 
                field: `item_${index}_name`, 
                message: `Item #${index + 1}: ${itemError.item_name}` 
              });
            }
            if (itemError?.quantity) {
              summary.push({ 
                field: `item_${index}_quantity`, 
                message: `Item #${index + 1}: ${itemError.quantity}` 
              });
            }
            if (itemError?.unit_price) {
              summary.push({ 
                field: `item_${index}_price`, 
                message: `Item #${index + 1}: ${itemError.unit_price}` 
              });
            }
          });
        }
      }
      
      // Deposit errors
      if (errors.deposit_type && touched.deposit_type) {
        summary.push({ field: 'deposit_type', message: errors.deposit_type });
      }
      if (errors.deposit_amount && touched.deposit_amount) {
        summary.push({ field: 'deposit_amount', message: errors.deposit_amount });
      }
      
      // Approval errors
      if (errors.client_signature && touched.client_signature) {
        summary.push({ field: 'signature', message: errors.client_signature });
      }
      
      // Reminder errors
      if (errors.reminders && Array.isArray(errors.reminders)) {
        errors.reminders.forEach((reminderError, index) => {
          if (reminderError && typeof reminderError === 'object') {
            if (reminderError.follow_up_schedule) {
              summary.push({ 
                field: `reminder_${index}_date`, 
                message: `Reminder #${index + 1}: Invalid date` 
              });
            }
            if (reminderError.reminder_type) {
              summary.push({ 
                field: `reminder_${index}_type`, 
                message: `Reminder #${index + 1}: ${reminderError.reminder_type}` 
              });
            }
            if (reminderError._temp_error) {
              summary.push({ 
                field: `reminder_${index}`, 
                message: `Reminder #${index + 1}: Both date and type are required` 
              });
            }
          }
        });
      }
      
      setValidationSummary(summary);
    } else {
      setValidationSummary([]);
    }
  }, [formik.errors, formik.touched]);

  return validationSummary;
};