import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { Stream } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
interface StreamMessage {
  id: number;
  message: string;
  user: {
    id: number;
    avatar: string;
  };
}
interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessages;
}
interface MessageForm {
  message: string;
}
const Streams: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, reset, handleSubmit } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null
  );
  const [sendMessage, { loading, data: sendMessageData }] =
    useMutation<StreamResponse>(
      `/api/streams/${router.query.id}/messages`,
      "POST"
    );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              {
                id: Date.now(),
                message: form,
                user: {
                  ...user,
                },
              },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };
  useEffect(() => {
    if (sendMessageData && sendMessageData?.ok) {
      mutate();
    }
  }, [sendMessageData, mutate]);
  useEffect(() => {
    if (data && !data?.ok) router.push("/404");
  }, [data, router]);
  return (
    <Layout canGoBack>
      <div className="space-y-4 py-10  px-4">
        <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="mt-3 block text-2xl text-gray-900">
            $ {data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="h-[50vh] space-y-4 overflow-y-scroll py-10  px-4 pb-16">
            {data?.stream?.messages?.map((message) => {
              const date = new Date();
              return (
                <Message
                  key={message?.id}
                  message={message?.message}
                  reversed={message?.user?.id === user?.id}
                  createAt={date}
                ></Message>
              );
            })}
            {/* <Message message="Hi how much are you selling them for?" />
            <Message message="I want ￦20,000" reversed />
            <Message message="미쳤어" /> */}
          </div>
          <div className="fixed inset-x-0 bottom-0  bg-white py-2">
            <form
              onSubmit={handleSubmit(onValid)}
              className="relative mx-auto flex w-full  max-w-md items-center"
            >
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
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Streams;
