// features/clients/components/ClientForm/LogoUploader.jsx
import React, { useEffect } from 'react';
import FileUploader from '../../../../components/common/FileUploader';

const LogoUploader = ({ formik, mode = 'create' }) => {
  // Debug: Log when formik values change
  useEffect(() => {
    console.log('🖼️ LogoUploader - Current values:', {
      logo_url: formik.values?.logo_url,
      logo_temp_id: formik.values?.logo_temp_id,
      remove_logo: formik.values?.remove_logo,
      errors: formik.errors,
      touched: formik.touched
    });
  }, [formik.values, formik.errors, formik.touched]);

  return (
    <FileUploader
      formik={formik}
      tempIdField="logo_temp_id"
      removeField="remove_logo"
      accept="image/*"
      maxSize={5 * 1024 * 1024}
      allowedTypes={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
      buttonText="Upload Logo"
      // helperText="Recommended: Square image, max 5MB"
      mode={mode}
      existingFileUrl={formik.values?.logo_url}
      existingFileName="Existing logo"
    />
  );
};

export default LogoUploader;