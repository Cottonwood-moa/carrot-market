import imageDelivery from "@libs/client/imageDelivery";
import { cls } from "../libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string | undefined | null;
  createAt: Date;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  createAt,
}: MessageProps) {
  const created = Date.now() - Date.parse(createAt as unknown as string);
  const time = Math.floor(created / (1000 * 60 * 60));
  const min = Math.floor(created / (1000 * 60));
  return (
    <div
      className={cls(
        "flex items-center",
        reversed ? "flex-row-reverse  space-x-2 space-x-reverse" : "space-x-2"
      )}
    >
      <img
        src={imageDelivery(avatarUrl, "avatar")}
        className="h-8 w-8 rounded-full bg-slate-400"
      />
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
      {createAt ? (
        <p className="text-xs font-thin text-gray-400">
          {time === 0 ? (min === 0 ? "방금" : min + "분 전") : time + "시간 전"}
        </p>
      ) : null}
    </div>
  );
}
