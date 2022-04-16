import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import { Product } from "@prisma/client";
import Skeleton from "@components/skeleton";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
export interface ProductWithCount extends Product {
  _count: {
    Fav: number;
  };
}

interface ProductResponse {
  ok: boolean;
  products: ProductWithCount[];
  error?: string;
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductResponse>("api/products");
  const router = useRouter();
  useEffect(() => {
    console.log(data);
    if (data && !data.ok && data?.error?.includes("login"))
      router.replace("/enter");
    else if (data && !data?.ok) router.replace("/404");
  }, [data, router]);
  return (
    <Layout title="홈" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {!data ? (
          <>
            <div className="mt-6 w-full space-y-16 pt-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, i) => {
                return (
                  <React.Fragment key={i}>
                    <Skeleton kind="product" />
                  </React.Fragment>
                );
              })}
            </div>
          </>
        ) : (
          data?.products?.map((product) => (
            <Item
              id={product.id}
              key={product.id}
              title={product.name}
              price={product.price}
              hearts={product._count.Fav}
              image={product.image}
            />
          ))
        )}
        <FloatingButton href="/products/upload">
          <svg
            className="h-6 w-6"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
