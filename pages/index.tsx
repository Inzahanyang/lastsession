import { Like, Tweet, User } from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface HomeForm {
  tweet: string;
}

interface TweetResponse {
  ok: boolean;
}

interface TweetWithUser extends Tweet {
  user: User;
  _count: {
    replise: number;
  };
  likes: Like[];
}

interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithUser[];
}

interface UserResponse {
  ok: boolean;
  user: User;
}

const Home: NextPage = () => {
  const { data: userData } = useSWR<UserResponse>("/api/users/me");
  const router = useRouter();
  useEffect(() => {
    if (userData && !userData.ok) {
      router.push("/login");
    }
  }, [userData, router]);

  const [resData, setResData] = useState<TweetResponse>();
  const { handleSubmit, register } = useForm<HomeForm>();
  const onValid = (data: HomeForm) => {
    fetch("/api/tweet", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setResData(data));
  };
  const { data: tweetData, mutate } = useSWR<TweetsResponse>("/api/tweet");

  console.log(tweetData);

  useEffect(() => {
    if (resData && resData.ok) {
      mutate();
    }
  }, [resData]);

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h2 className="border border-b-0 px-4 py-4 border-t-0 flex relative">
        <span className="font-bold text-xl text-gray-800">Home</span>
        <span className="absolute -left-14">
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
      </h2>
      <form className="border pt-4 px-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex space-x-2 items-center">
          <div
            className={`h-8 w-8 rounded-full flex-none flex items-center justify-center text-white ${
              userData?.user?.email ? "bg-orange-400" : "bg-teal-400"
            }`}
          >
            <span className="text-xs">
              {userData?.user?.name[0].toUpperCase()}
            </span>
          </div>
          <input
            {...register("tweet", { required: true, min: 5 })}
            type="text"
            placeholder="What's happening?"
            className="w-full text-gray-800 py-4 focus:border-none focus:outline-none px-2 placeholder:text-xl"
          />
        </div>
        <div className="flex justify-end mb-4">
          <button className="bg-blue-300 py-3 px-6 rounded-full text-white font-bold text-sm">
            Tweet
          </button>
        </div>
      </form>
      {tweetData?.tweets?.map((tweet) => (
        <>
          <Link href={`/tweet/${tweet.id}`} key={tweet.id}>
            <div className="flex border border-t-0 border-b-0 pt-6 pb-3 cursor-pointer">
              <div className="flex space-x-3 px-4">
                <div
                  className={`h-12 w-12 rounded-full flex-none flex items-center justify-center text-white ${
                    tweet.user.email ? "bg-orange-400" : "bg-teal-400"
                  }`}
                >
                  <span>{tweet?.user.name[0].toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 mr-2">
                    {tweet.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(tweet?.updatedAt as any).toLocaleTimeString(
                      "kr-ko"
                    )}
                  </span>
                  <p className="text-gray-800 pt-1">{tweet.tweet}</p>
                </div>
              </div>
            </div>
          </Link>
          <div className="flex items-center justify-around border border-t-0 pb-2">
            <div className="flex items-center justify-center space-x-1.5">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-3 h-3 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </span>
              <span className="text-xs font-bold text-gray-600">
                {tweet._count.replise}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-1.5">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-3 h-3 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </span>
              <span className="text-xs font-bold text-gray-600">
                {tweet.likes.length}
              </span>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Home;

// "/" : Check login true move to "/" page if not move to "/create-account" page,
//  After logging in, in the Home page, the user should see all the Tweets on the database,
// the user should also be able to POST a Tweet.
