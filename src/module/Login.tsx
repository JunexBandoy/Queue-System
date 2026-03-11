import { useState } from "react";
import { useNavigate } from "react-router";
import {
  InputEmail,
  InputPassword,
  LoginWithGoogle,
  SignInButton,
} from "../core/components/Login";

interface Props {
  swithMode: () => void;
}

export const Login: React.FC<Props> = ({ swithMode }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center py-8 items-center px-4">
      <div className="shadow-md border rounded-2xl border-gray-300 px-6 w-full py-8 space-y-8 bg-white">
        <div className="space-y-2">
          <h3 className="text-4xl font-bold">Login</h3>
          <p className="text-lg">Welcome Back!</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
};
