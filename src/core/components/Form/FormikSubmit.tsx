import tw from "tailwind-styled-components";

interface ButtonProps {
  onClick?: () => void;
  disabled: boolean;
}

const BaseButton = tw.button<ButtonProps>`
bg-primary-400 hover:bg-primary-500 text-white w-full shadow-md rounded-md py-2 px-8
${(props) =>
  !props.disabled &&
  "bg-primary-400 hover:bg-primary-500 text-white w-full shadow-md rounded-md py-2 px-8"} 
${(props) =>
  !!props.disabled &&
  "bg-gray-200 text-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-offset-2 cursor-not-allowed"} 
`;

interface Props {
  label: string;
  disabled: boolean;
  onClick?: () => void;
}

export const FormikSubmit: React.FC<Props> = ({ onClick, disabled, label }) => {
  return (
    <div className="items-end  grid">
      <BaseButton type="submit" disabled={disabled} onClick={onClick}>
        {label}
      </BaseButton>
    </div>
  );
};
