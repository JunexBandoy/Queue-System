import { FieldHookConfig, useField } from 'formik';
import tw from 'tailwind-styled-components';

interface BaseInputProps {
    hasError: boolean;
}

const BaseInput = tw.input<BaseInputProps>
    `border rounded-md p-2 w-full border-gray-300
    ${(props) =>
        !props.hasError &&
        !props.value &&
        'border-primary-300 focus:border-primary-500 focus:ring-primary-500'}
    ${(props) =>
        !props.hasError &&
        !!props.value &&
        'border-primary-300 focus:border-primary-500 focus:ring-primary-500'}
    ${(props) =>
        props.hasError &&
        !!props.value &&
        'border-primary-300 focus:border-primary-500 focus:ring-primary-500'}
    ${(props) =>
        props.hasError &&
        !!props.value &&
        'border-red-300 focus:border-red-500 focus:ring-red-100'}
    `;

type Props = {
  label?: string;
  dataType?: 'text' | 'number';
  readonly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & FieldHookConfig<string>;

export const FormikInput: React.FC<Props> = ({
  label,
  dataType = 'text',
  readonly,
  onChange,
  ...props
}) => {
    const [field, meta] = useField(props);

    return (
    <div>
        <div className="text-gray-800 text-sm py-1">{label}</div>
        
        <div>
            <BaseInput
                {...field}
                datatype={dataType}
                readOnly={readonly}
                type='text'
                onChange={(e: any) => {
            field.onChange(e);
            onChange && onChange(e);
          }}
          hasError={!!meta.error}
            />
            {meta.error ? (
          <div className="text-red-500 text-sm">
            {meta.error}
          </div>
        ) : null}
        </div>   
            
    </div>
    )
}
