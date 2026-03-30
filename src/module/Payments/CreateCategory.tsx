import { Formik } from "formik";
import { CancelButton, FormsContainer } from "../../core/components/Form";
import { FormikInput } from "../../core/components/Form/FormikInput";
import { FormikSubmit } from "../../core/components/Form/FormikSubmit";
import {
  categoryDefaultValue,
  categoryValidationSchema,
} from "../../models/Category";
import { CategoryServices } from "../../services/Category";

interface Props {
  onClose?: () => void;
  loadData?: () => void;
}

export const CreateCategory: React.FC<Props> = ({ onClose, loadData }) => {
  return (
    <>
      <Formik
        initialValues={categoryDefaultValue}
        validationSchema={categoryValidationSchema}
        validateOnBlur={true}
        validateOnChange={true}
        onSubmit={async (value, actions) => {
          try {
            const result = await CategoryServices.create(value);
            if (result.status === 201) {
              loadData?.();
              onClose?.();
            } else {
              console.error("create error:", result);
              alert("An error occurred while creating the category.");
            }
          } catch (error: any) {
            console.error("create error:", error);
            alert("An error occurred while creating the category.");
          } finally {
            actions.setSubmitting(false);
          }
        }}
      >
        {(formikProps) => {
          return (
            <>
              <form method="POST" onSubmit={formikProps.handleSubmit}>
                <FormsContainer>
                  <FormikInput name="name" label="Name" required />
                  <FormikInput name="description" label="Description" />
                </FormsContainer>
                <div className="flex justify-end space-x-3">
                  <CancelButton onClick={() => onClose?.()}>
                    Cancel
                  </CancelButton>
                  <FormikSubmit
                    label="Save"
                    disabled={formikProps.isSubmitting}
                  />
                </div>
              </form>
            </>
          );
        }}
      </Formik>
    </>
  );
};
