// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");

  const queryClient = useQueryClient();

  const { mutate: logIn, isPending } = useMutation({
    mutationFn: async (userData) => {
      const res = await axiosInstance.post("/auth/login", userData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const handelSubmit = (e) => {
    e.preventDefault();
    logIn({ email, passWord });
  };
  return (
    <form className="space-y-6" onSubmit={handelSubmit}>
      <div>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          id="passWord"
          name="passWord"
          placeholder="Password"
          className="input input-bordered w-full"
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {isPending ? <Loader className="w-5 h-5 animate-spin" /> : "Login now"}
      </button>
    </form>
  );
};

export default LoginForm;
