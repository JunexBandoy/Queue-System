import { useState } from "react";

import { InputEmail, InputPassword } from "../core/components/Login";
import { InputText } from "../core/components/Form";

interface Props {
  swithMode: () => void;
}

export const Signup: React.FC<Props> = ({ swithMode }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center py-8 items-center px-4">
      <div className="shadow-md border rounded-2xl border-gray-300 px-6 py-8 w-full space-y-8 bg-white">
        <div className="space-y-2">
          <h3 className="text-4xl font-bold">Signup</h3>
          <p className="text-lg">Welcome!</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <InputText
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <InputEmail
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <InputPassword
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="w-full flex items-center justify-center">
            <p className="text-sm font-normal text-gray-400">
              Do you have an account?{" "}
              <button
                onClick={swithMode}
                className="font-semibold italic text-primary-400 hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
