import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useSWR from "swr";
import { Chat, Product, User } from "@prisma/client";
import useUser from "@libs/client/useUser";
interface ChatMessage {
  message: string;
}
interface Buyer {
  avatar: string;
  name: string;
  id: number;
}
interface ProductWithUser extends Product {
  user: User;
}
interface ChatWithBuyer extends Chat {
  buyer: Buyer;
  ChatMessage: ChatMessage[];
  product: ProductWithUser;
}
interface ChatsResponse {
  ok: boolean;
  chat: ChatWithBuyer[];
}
const Chats: NextPage = () => {
  const { data } = useSWR<ChatsResponse>(`/api/chats`, {
    refreshInterval: 100,
  });
  const { user } = useUser();
  return (
    <Layout hasTabBar title="채팅">
      <div className="divide-y-[1px] ">
        {data?.chat?.map((chat) => (
          <Link href={`/chats/${chat?.id}`} key={chat?.id}>
            <a className="flex w-full cursor-pointer items-center space-x-3 px-4 py-3">
              <div className="h-12 w-12 rounded-full bg-slate-300" />
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-gray-700">
                    {chat?.product?.user?.id === user?.id
                      ? chat?.buyer?.name
                      : chat?.product?.user?.name}
                  </p>
                  <p className="text-sm text-orange-500">
                    {chat?.product?.user?.id === user?.id
                      ? "내가 등록한 상품"
                      : ""}
                  </p>
                </div>
                <p className="text-xs font-thin text-gray-400">
                  {chat?.product?.name}
                </p>
                <p className="text-sm  text-gray-500">
                  {chat?.ChatMessage[0]?.message}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
