// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    passWord: "",
  });

  const queryClient = useQueryClient();

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
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

  const handelSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    signUp(formData);
    setFormData({
      name: "",
      userName: "",
      email: "",
      passWord: "",
    });
  };
  return (
    <form onSubmit={handelSubmit} className="space-y-6">
      <div>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          required
          className="input input-bordered w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <input
          type="text"
          id="userName"
          name="userName"
          placeholder="userName"
          required
          className="input input-bordered w-full"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
        />
      </div>
      <div>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          className="input input-bordered w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <input
          type="password"
          id="passWord"
          name="passWord"
          placeholder="passWord"
          required
          className="input input-bordered w-full"
          value={formData.passWord}
          onChange={(e) =>
            setFormData({ ...formData, passWord: e.target.value })
          }
        />
      </div>
      <button type="submit" className="btn btn-primary w-full">
        {isPending ? <Loader className="w-5 h-5 animate-spin" /> : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
