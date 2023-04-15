import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SignUpForm {
  name: string;
  email?: string;
  phone?: string;
}

interface SignUpResponse {
  ok: boolean;
}

const SignUp: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<SignUpResponse>();
  const { handleSubmit, register, reset, watch } = useForm<SignUpForm>();
  const [signup, setSignup] = useState<"email" | "phone">("email");
  const useEmail = () => {
    reset({
      name: watch("name"),
      email: "",
    });
    setSignup("email");
  };
  const usePhone = () => {
    reset({ name: watch("name"), phone: "" });
    setSignup("phone");
  };

  const onValid = (data: SignUpForm) => {
    fetch("/api/users/signup", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => setData(result));
  };

  useEffect(() => {
    if (data && data.ok) {
      router.replace("/login", { query: signup });
    }
  }, [router, data]);

  return (
    <div className="max-w-lg h-screen mt-24 mx-auto">
      <h2 className="flex justify-center mb-24">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-8 w-6 text-blue-400"
        >
          <g>
            <path
              fill="currentcolor"
              d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
            ></path>
          </g>
        </svg>
      </h2>
      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col space-y-4"
      >
        <input
          className="border py-3 rounded-md px-3"
          {...register("name", { required: true, minLength: 3 })}
          type="text"
          placeholder="이름"
        />

        {signup === "email" ? (
          <div className="flex flex-col">
            <input
              className="border py-3 rounded-md px-3"
              {...register("email", { required: true })}
              type="email"
              name="email"
              placeholder="이메일"
            />
            <div className="flex justify-between px-2">
              <Link href="/login">
                <span
                  className="text-sm mt-2 text-blue-400 cursor-pointer"
                  onClick={useEmail}
                >
                  로그인하기
                </span>
              </Link>
              <span
                className="text-sm mt-2 text-blue-400 cursor-pointer"
                onClick={usePhone}
              >
                대신 휴대폰 사용하기
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <input
              className="border py-3 rounded-md px-3"
              {...register("phone", { required: true })}
              type="tel"
              placeholder="휴대폰"
            />
            <div className="flex justify-between px-2">
              <Link href="/login">
                <span className="text-sm mt-2 text-blue-400 cursor-pointer">
                  로그인하기
                </span>
              </Link>
              <span
                className="text-sm mt-2 text-blue-400 cursor-pointer"
                onClick={useEmail}
              >
                대신 이메일 사용하기
              </span>
            </div>
          </div>
        )}
        <button className="bg-blue-400 text-white rounded-3xl font-bold text-lg py-3">
          가입하기
        </button>
      </form>
    </div>
  );
};
export default SignUp;
