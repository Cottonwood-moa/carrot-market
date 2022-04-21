import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import { Chat, Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { ContextType, useEffect } from "react";
import useUser from "@libs/client/useUser";
import imageDelivery from "@libs/client/imageDelivery";
import Image from "next/image";
import client from "@libs/server/client";
import ssrJson from "@libs/server/ssrJson";
interface ProductWithUser extends Product {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  isLiked: boolean;
  relatedProducts: Product[];
}
interface CreateChatResponse {
  ok: boolean;
  chat: Chat;
}
const ItemDetail: NextPage<{ product: ProductWithUser }> = ({ product }) => {
  const router = useRouter();
  const { user } = useUser();
  // 프로덕트
  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  // 채팅
  const [createChat, { loading, data: chatData }] =
    useMutation<CreateChatResponse>(`/api/chats`, "POST");
  // 하트
  const [toggleFav] = useMutation(
    `/api/products/${router.query.id}/fav`,
    "POST"
  );
  const onFavClick = () => {
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    toggleFav({});
  };
  const talkToSeller = (productId: number) => {
    if (loading) return;
    createChat({ productId });
  };
  useEffect(() => {
    if (chatData && chatData.ok) router.push(`/chats/${chatData.chat.id}`);
  }, [chatData, router]);
  // 첫번째 방문자를 위한 로딩
  if (router.isFallback) {
    return <Layout title="Loading For UUUU">loading</Layout>;
  }
  return (
    <Layout canGoBack>
      <div className="px-4  py-4">
        <div className="mb-8">
          <img
            src={imageDelivery(product?.image, "product")}
            className="h-96 w-full rounded-lg  bg-slate-300"
          />
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            <img
              src={imageDelivery(product?.user?.avatar, "avatar")}
              className="h-12 w-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user?.name}
              </p>
              <Link href={`/users/profiles/${product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-xl font-bold text-gray-900">{product?.name}</h1>
            <span className="mt-3 block text-xl text-gray-900">
              ${product?.price}
            </span>
            <p className=" my-6 text-gray-700">{product?.description}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button
                large
                text="Talk to seller"
                disabled={user?.id === product?.userId}
                onClick={() => talkToSeller(product?.id as number)}
              />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-300",
                  data?.isLiked
                    ? "text-red-400 hover:text-red-500"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts.map((product) => (
              <div key={product.id}>
                <Image
                  src={imageDelivery(product?.image, "product")}
                  width={232}
                  height={224}
                  className="mb-4 h-56 w-full bg-slate-300"
                  alt=""
                />
                <h3 className="-mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-gray-700">
                  {product.name}
                </h3>
                <span className="text-sm font-medium text-gray-900">
                  ${product.price}
                </span>
              </div>
            ))}
          </div>
          {data?.relatedProducts.length === 0 && (
            <div className="w-full p-10 text-center text-lg font-semibold text-orange-400">
              <p>비슷한 아이템이 없어요.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export const getStaticProps: GetStaticProps = async (ctx) => {
  const {
    params: { id },
  } = ctx as any;
  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  return {
    props: {
      product: ssrJson(product),
    },
  };
};
export default ItemDetail;
