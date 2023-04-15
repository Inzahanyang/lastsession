import { Reply, Tweet, User } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface UserResponse {
  ok: boolean;
  user: User;
}

interface ReplyForm {
  reply: string;
}

interface ReplyResponse {
  ok: boolean;
}

interface ReplyWithUser extends Reply {
  user: {
    name: string;
    phone: string;
    email: string;
  };
}

interface TweetNUserNReply extends Tweet {
  user: User;
  replise: ReplyWithUser[];
  _count: {
    replise: number;
  };
}

interface TweetResponse {
  ok: boolean;
  tweet: TweetNUserNReply;
  isLiked: boolean;
}

const Detail: NextPage = () => {
  const router = useRouter();
  const back = () => router.push("/");

  const { data: userData } = useSWR<UserResponse>("/api/users/me");
  useEffect(() => {
    if (userData && !userData.ok) {
      router.push("/login");
    }
  }, [userData, router]);

  const { data, mutate } = useSWR<TweetResponse>(
    router.query ? `/api/tweet/${router.query.id}` : null
  );

  const { handleSubmit, register, reset } = useForm<ReplyForm>();
  const [replyData, setReplyData] = useState<ReplyResponse>();
  const onValid = (data: ReplyForm) => {
    reset();
    fetch(`/api/tweet/${router.query.id}/reply`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setReplyData(data));
  };

  useEffect(() => {
    if (replyData && replyData.ok) {
      mutate();
    }
  }, [replyData]);

  const [likeLoading, setLikeLoading] = useState(false);

  const likeBtn = () => {
    setLikeLoading(true);
    if (likeLoading) return;
    fetch(`/api/tweet/${data?.tweet.id}/like`, {
      method: "POST",
    });
    setLikeLoading(false);
    mutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div
        className="border relative border-b-0 flex items-center cursor-pointer pt-4 space-x-4 px-4 "
        onClick={back}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </span>
        <h2 className="font-bold text-xl text-gray-800">Tweet</h2>
        <span className="absolute -left-20">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-10 w-10 text-blue-400"
          >
            <g>
              <path
                fill="currentcolor"
                d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
              ></path>
            </g>
          </svg>
        </span>
      </div>
      <div className="border border-t-0 pt-6">
        <div className="flex space-x-3 px-4">
          <div
            className={`h-12 w-12 rounded-full flex-none flex items-center justify-center text-white ${
              data?.tweet?.user.email ? "bg-orange-400" : "bg-teal-400"
            }`}
          >
            <span>{data?.tweet?.user.name[0].toUpperCase()}</span>
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <span className="font-bold text-gray-800">
                {data?.tweet?.user?.name}
              </span>
              <span>
                <svg
                  viewBox="0 0 22 22"
                  aria-label="Verified account"
                  role="img"
                  className="text-blue-400 w-4 h-4"
                  data-testid="icon-verified"
                >
                  <g>
                    <path
                      fill="currentcolor"
                      d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                    ></path>
                  </g>
                </svg>
              </span>
            </div>
            <span className="text-gray-500">
              {data?.tweet?.user?.email
                ? `@${data.tweet.user.email.split("@")[0]}`
                : data?.tweet?.user?.phone}
            </span>
          </div>
        </div>
        <p className="text-gray-800 pt-4 mb-2 px-4">{data?.tweet?.tweet}</p>
        <div className="space-x-3 px-4">
          <span className="text-xs text-gray-500">
            {new Date(data?.tweet?.updatedAt as any).toLocaleTimeString(
              "kr-ko"
            )}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(data?.tweet?.updatedAt as any).toDateString()}
          </span>
        </div>
        <div className="flex items-center justify-around mt-4 border-t py-2">
          <div className="flex items-center justify-center space-x-1.5">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                className="w-6 h-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </span>
            <span className="text-xs font-bold text-gray-600">
              {data?.tweet._count.replise}
            </span>
          </div>
          {data?.isLiked ? (
            <span onClick={likeBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </span>
          ) : (
            <span onClick={likeBtn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </span>
          )}
        </div>
      </div>
      <form
        className="border border-t-0 pt-4 px-4"
        onSubmit={handleSubmit(onValid)}
      >
        <div className="flex space-x-2 items-center">
          <div
            className={`h-6 w-6 rounded-full flex-none flex items-center justify-center text-white ${
              userData?.user.email ? "bg-orange-400" : "bg-teal-400"
            }`}
          >
            <span className="text-xs">
              {userData?.user.name[0].toUpperCase()}
            </span>
          </div>
          <input
            {...register("reply", { required: true, min: 5 })}
            type="text"
            placeholder="Tweet your reply"
            className="w-full text-gray-800 py-4 focus:border-none focus:outline-none px-2 placeholder:text-sm"
          />
        </div>
        <div className="flex justify-end mb-4">
          <button className="bg-blue-300 py-3 px-6 rounded-full text-white font-bold text-sm">
            Reply
          </button>
        </div>
      </form>
      {data?.tweet?.replise.map((reply) => (
        <div key={reply.id} className="border border-t-0 px-4 py-3">
          <div className="flex space-x-3 items-center">
            <div
              className={`h-10 w-10 rounded-full flex-none flex items-center justify-center ${
                reply.user.email ? "bg-orange-500" : "bg-emerald-500"
              }`}
            >
              <span className="text-white">
                {reply.user.name[0].toUpperCase()}
              </span>
            </div>
            <div>
              <div className="space-x-2">
                <span className="font-semibold text-sm">{reply.user.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(reply.updatedAt).toLocaleTimeString()}
                </span>
              </div>
              <p>{reply.reply}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Detail;
