import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
interface EditProfileForm {
  name?: string;
  email?: string;
  phone?: string;
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
  } = useForm<EditProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileMutationResponse>(`/api/users/me`, "POST");
  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
  }, [user, setValue]);
  const onValid = ({ name, email, phone }: EditProfileForm) => {
    if (loading) return;
    if (email === "" && phone === "" && name === "")
      return setError("error", {
        message: "Email or phone number are required. You need to choose one ",
      });
    editProfile({
      name: name !== user?.name ? name : "",
      email: email !== user?.email ? email : "",
      phone: phone !== user?.phone ? phone : "",
    });
  };
  useEffect(() => {
    if (data && !data.ok) {
      setError("error", { message: data?.error });
    }
  }, [data, setError]);
  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
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
