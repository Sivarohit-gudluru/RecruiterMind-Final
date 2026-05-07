import { useState } from "react";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "./firebase";

export default function Login({
  onLogin
}) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [signup, setSignup] =
    useState(false);

  const handleAuth = async () => {

    try {

      if (signup) {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      } else {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      }

      onLogin();

    } catch (err) {

      alert(err.message);

    }

  };

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-[#0f0f0f]
    ">

      <div className="
        bg-[#181818]
        p-10
        rounded-3xl
        w-[400px]
        space-y-6
      ">

        <h1 className="
          text-white
          text-4xl
          font-bold
        ">
          RecruitMind
        </h1>

        <input
          placeholder="Email"
          className="
            w-full
            p-4
            rounded-xl
            bg-[#242424]
            text-white
          "
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full
            p-4
            rounded-xl
            bg-[#242424]
            text-white
          "
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button
          onClick={handleAuth}
          className="
            w-full
            bg-purple-600
            text-white
            py-4
            rounded-xl
          "
        >
          {signup
            ? "Create Account"
            : "Login"}
        </button>

        <button
          onClick={() =>
            setSignup(!signup)
          }
          className="
            text-gray-400
            text-sm
          "
        >
          {signup
            ? "Already have account?"
            : "Create new account"}
        </button>

      </div>

    </div>
  );
}