import type { NextPage } from "next";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Answer, Post, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useUser from "@libs/client/useUser";
interface AnswerWithUser extends Answer {
  user: User;
}
interface Count {
  Answer: number;
  Wondering: number;
}
interface PostWithUser extends Post {
  user: User;
  _count: Count;
  Answer: AnswerWithUser[];
}

interface PostsResponse {
  ok: boolean;
  post: PostWithUser;
  isWonderd: boolean;
}
interface AnswerForm {
  answer: string;
}
interface AnswerResponse {
  ok: boolean;
  answer: Answer;
}
interface DeleteResponse {
  ok: boolean;
  deleteData: Answer;
}
const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<AnswerForm>();
  const { data, error, mutate } = useSWR<PostsResponse>(
    router.query.id ? `/api/posts/${router.query.id}` : null
  );
  const [wonder, { loading }] = useMutation<AnswerResponse>(
    `/api/posts/${router.query.id}/wonder`,
    `POST`
  );
  const [deleteAnswer, { data: deleteData, loading: deleteLoading }] =
    useMutation<DeleteResponse>(
      `/api/posts/${router.query.id}/answers`,
      "DELETE"
    );
  const [sendAnswer, { data: answerData, loading: answerLoading }] =
    useMutation(`/api/posts/${router.query.id}/answers`, "POST");
  const onWonderClick = () => {
    if (!data) return;
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isWonderd: !prev?.isWonderd,
          // 객체 안 객체 -> 참조형이므로 스프레드연산자로 따로 복사해줘야함.
          post: {
            ...prev.post,
            _count: {
              ...prev.post._count,
              Wondering: prev.isWonderd
                ? prev.post._count.Wondering - 1
                : prev.post._count.Wondering + 1,
            },
          },
        },
      false
    );
    if (!loading) {
      wonder({});
    }
  };
  const onValid = (form: AnswerForm) => {
    if (answerLoading) return;
    sendAnswer(form);
  };
  const onDelete = (id: number) => {
    if (loading) return;
    deleteAnswer(id);
    mutate();
  };
  useEffect(() => {
    if (answerData && answerData.ok) {
      mutate();
      reset();
    }
  }, [answerData, reset, mutate]);
  useEffect(() => {
    if (deleteData && deleteData.ok) {
      mutate();
    }
  }, [deleteData, mutate]);
  return (
    <Layout canGoBack>
      <div>
        <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          동네질문
        </span>
        <div className="mb-3 flex cursor-pointer items-center space-x-3  border-b px-4 pb-3">
          <div className="h-10 w-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {data?.post?.user?.name}
            </p>
            <Link href={`/users/profiles/${data?.post?.user?.id}`}>
              <a className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 text-gray-700">
            <span className="font-medium text-orange-500">Q.</span>
            {data?.post?.question}
          </div>
          <div className="mt-3 flex w-full space-x-5 border-t border-b-[2px] px-4 py-2.5  text-gray-700">
            <button
              onClick={onWonderClick}
              className={cls(
                "flex items-center space-x-2 text-sm",
                data?.isWonderd ? "text-green-500" : ""
              )}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {data?.post?._count?.Wondering}</span>
            </button>
            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data?.post?._count?.Answer}</span>
            </span>
          </div>
        </div>
        <div className="my-5 space-y-5 px-4">
          {data?.post?.Answer.map((answer) => {
            return (
              <div
                key={answer.id}
                className="relative flex items-start  space-x-3"
              >
                <div className="h-8 w-8 rounded-full bg-slate-200" />
                <div>
                  <span className="block text-sm font-medium text-gray-700">
                    {answer?.user?.name}
                  </span>
                  <span className="block text-xs text-gray-500 ">
                    {answer?.createdAt}
                  </span>
                  <p className="mt-2 text-gray-700">{answer?.answer}</p>
                </div>
                <div
                  onClick={() => onDelete(answer.id)}
                  className="absolute right-0 cursor-pointer text-sm font-medium text-gray-500 transition hover:text-gray-900"
                >
                  삭제
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-4">
          <form onSubmit={handleSubmit(onValid)}>
            <TextArea
              name="description"
              register={register("answer", {
                required: true,
                minLength: 5,
              })}
              placeholder="Answer this question!"
              required
            />
            <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
              {answerLoading ? "Loading" : "Reply"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
