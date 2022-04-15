import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { useRouter } from "next/router";
import { cls } from "@libs/client/utils";
interface UploadProductForm {
  name: string;
  price: string;
  description: string;
  productImage: FileList;
}

interface UploadProductMutation {
  ok: boolean;
  product: Product;
}
const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadProductForm>();
  const [uploadProduct, { loading, data }] = useMutation<UploadProductMutation>(
    "/api/products",
    "POST"
  );
  const onValid = async ({
    name,
    price,
    description,
    productImage,
  }: UploadProductForm) => {
    // 요청이 진행 중일 때는 form 제출이 안되게
    if (loading) return;
    const { uploadURL } = await (await fetch(`/api/files`)).json();
    const form = new FormData();
    form.append("file", productImage[0]);
    const {
      result: { id },
    } = await (
      await fetch(uploadURL, {
        method: "POST",
        body: form,
      })
    ).json();
    uploadProduct({
      name,
      price,
      description,
      productImage: id,
    });
  };
  const productImage = watch("productImage");
  const [productImagePreview, setProductImagePreview] = useState("");
  useEffect(() => {
    if (productImage && productImage.length > 0)
      setProductImagePreview(URL.createObjectURL(productImage[0]));
  }, [productImage, setProductImagePreview]);

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Upload Product">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <div>
          <label
            className={cls(
              `flex h-48 w-full cursor-pointer items-center justify-center rounded-md  border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500`,
              !productImage ? "border-2 border-dashed" : ""
            )}
          >
            {productImagePreview ? (
              <img className="h-48 w-full" src={productImagePreview}></img>
            ) : (
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <input
              {...register("productImage")}
              className="hidden"
              type="file"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name", {
            required: true,
            maxLength: 20,
          })}
          required
          label="Name"
          name="name"
          type="text"
          maxLength={20}
        />
        <Input
          register={register("price", {
            required: true,
          })}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", {
            required: true,
          })}
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading" : "Upload item"} />
      </form>
    </Layout>
  );
};

export default Upload;
