import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Chat, ChatMessage, Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import React, { useEffect } from "react";
import useUser from "@libs/client/useUser";
interface ChatForm {
  message: string;
}
interface ProductWithUser extends Product {
  user: User;
}
interface ChatWithMessages extends Chat {
  ChatMessage: ChatMessage[];
  product: ProductWithUser;
}
interface ChatMessagesResponse {
  ok: boolean;
  chatMessages: ChatWithMessages;
}

const ChatDetail: NextPage = () => {
  // const [sendMessage, {data,loading}] = useMutation()
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<ChatMessagesResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null
  );
  const [sendMessage, { data: sendMessageData, loading }] = useMutation(
    `/api/chats/${router.query.id}`,
    "POST"
  );
  const { register, handleSubmit, reset } = useForm<ChatForm>();
  const onValid = (message: ChatForm) => {
    if (loading) return;
    sendMessage(message);
    reset();
  };
  useEffect(() => {
    if (data && data.ok) {
      mutate();
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [data, sendMessageData, mutate]);
  return (
    <Layout
      canGoBack
      title={
        data?.chatMessages?.product?.name +
        " - " +
        data?.chatMessages?.product?.user?.name
      }
    >
      <div className="space-y-4 py-10 px-4 pb-16">
        {data?.chatMessages?.ChatMessage.map((message) => {
          return (
            <React.Fragment key={message?.id}>
              <Message
                message={message?.message}
                reversed={message?.userId === user?.id}
              />
            </React.Fragment>
          );
        })}
        {/* <Message message="Hi how much are you selling them for?" />
        <Message message="I want ￦20,000" reversed />
        <Message message="미쳤어" /> */}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed inset-x-0 bottom-0  bg-white py-2"
        >
          <div className="relative mx-auto flex w-full  max-w-md items-center">
            <input
              {...register("message", {
                required: true,
              })}
              type="text"
              className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
