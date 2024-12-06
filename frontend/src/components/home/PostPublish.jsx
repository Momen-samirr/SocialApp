// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

const PostPublish = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      resetForm();
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
  });

  const handelImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handelPostCreation = async () => {
    try {
      const postData = { content };
      if (image) postData.image = await readFileAsDataURL(image);
      createPost(postData);
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="bg-secondary rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user?.data?.profilePicure || "/avatar.png"}
          alt={user?.data?.name}
          className="size-12 rounded-full"
        />
        <textarea
          id="content"
          name="content"
          placeholder="What's on your mind bro?"
          className="w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected Image"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-5">
          <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <Image className="mr-2" size={20} />
            <span>Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handelImageChange}
            />
          </label>
        </div>
        <button
          className="btn btn-primary text-white"
          onClick={handelPostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostPublish;
