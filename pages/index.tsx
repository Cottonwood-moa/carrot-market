import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import Skeleton from "@components/skeleton";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import client from "@libs/server/client";
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
  const router = useRouter();
  const { data } = useSWR<ProductResponse>("api/products");
  // useEffect(() => {
  //   console.log(data);
  //   if (data && !data.ok && data?.error?.includes("login"))
  //     router.replace("/enter");
  //   else if (data && !data?.ok) router.replace("/404");
  // }, [data, router]);
  return (
    <Layout title="홈" hasTabBar>
      <div className="flex flex-col space-y-5 divide-y">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.Fav}
            image={product.image}
          />
        ))}
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

// 캐쉬초기값을 SSR에서 제공하는 데이터로 설정하고
// 그 뒤로는 SWR기능을 그냥 사용한다.

const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "api/products": {
            ok: true,
            products,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};
export async function getServerSideProps() {
  const prouducts = await client?.product.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      _count: {
        select: {
          Fav: true,
        },
      },
    },
  });
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    props: {
      // Next.js가 Prisma가 제공하는 날짜 포맷을 이해하지 못하기 때문에 JSON 작업 필요
      products: JSON.parse(JSON.stringify(prouducts)),
    },
  };
}
export default Page;
