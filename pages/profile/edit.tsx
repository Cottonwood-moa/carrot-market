import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import imageDelivery from "@libs/client/imageDelivery";
interface EditProfileForm {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: FileList;
  error?: string;
}
interface EditProfileMutationResponse {
  ok: boolean;
  error?: string;
}
const EditProfile: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<EditProfileForm>();

  const [editProfile, { data, loading }] =
    useMutation<EditProfileMutationResponse>(`/api/users/me`, "POST");

  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
  }, [user, setValue]);
  // submit
  const onValid = async ({ name, email, phone, avatar }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "")
      return setError("error", {
        message: "Email or phone number are required. You need to choose one ",
      });
    if (avatar && avatar.length > 0 && user) {
      // 저장할 CF URL
      const { uploadURL } = await (await fetch(`/api/files`)).json();
      // 자바스크립트로 FORM 만들기
      const form = new FormData();
      // append의 user?.id +""는 사진이름 바꾸는 옵션
      form.append("file", avatar[0], user?.id + "");
      // image file POST 요청 -> CF URL로
      // 여기서 나온 id가 저장됨 -> user.avatar
      console.log(form);
      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editProfile({
        name: name !== user?.name ? name : "",
        email: email !== user?.email ? email : "",
        phone: phone !== user?.phone ? phone : "",
        avatarId: id,
      });
    } else {
      editProfile({
        name: name !== user?.name ? name : "",
        email: email !== user?.email ? email : "",
        phone: phone !== user?.phone ? phone : "",
      });
    }
  };
  // form error
  useEffect(() => {
    if (data && !data.ok) {
      setError("error", { message: data?.error });
    }
  }, [data, setError]);
  // https://nomadcoders.co/carrot-market/lectures/3587
  const avatar = watch("avatar");
  const [avatarPreview, setAvatarPreview] = useState("");
  useEffect(() => {
    if (avatar && avatar.length > 0) {
      const file = avatar[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, [avatar]);
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          <img
            src={
              avatarPreview
                ? avatarPreview
                : imageDelivery(user?.avatar, "avatar")
            }
            className="h-14 w-14 rounded-full bg-slate-500"
          />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name", {
            minLength: {
              value: 2,
              message: "Name need to 2 characters",
            },
          })}
          label="Name"
          name="name"
          // defaultValue={user?.email}
        />
        <Input
          register={register("email")}
          label="Email address"
          name="email"
          type="email"
          // defaultValue={user?.email}
        />
        <Input
          register={register("phone")}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
          // defaultValue={user?.phone}
        />
        <span className="my-2 block text-center font-medium text-red-500">
          {errors.error?.message}
          {errors.name?.message}
        </span>

        <Button text={loading ? "Loading" : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
