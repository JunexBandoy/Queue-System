interface Props {
  label: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  onMultipleChange?: (files: File[]) => void;
}

export const InputImg: React.FC<Props> = ({ label, value, onMultipleChange, onChange }) => {
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 0) {
      if (onMultipleChange) {
        onMultipleChange(files);
      } else if (onChange) {
        onChange(files[0]);
      }
    } else {
      if (onChange) onChange(null);
    }
  };

  return (
    <div>
      <div className="text-gray-800 text-sm py-1">{label}</div>
      <input
        type="file"
        accept="image/*"
        multiple
        className="border rounded-md p-2 w-full border-gray-300"
        onChange={handleChange}
      />
    </div>
  );
};
