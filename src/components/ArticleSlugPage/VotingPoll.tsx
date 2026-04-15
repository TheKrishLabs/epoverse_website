"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { changeVote, createVote, getPolls } from "@/services/pollService";
import { useRouter } from "next/navigation";

type Option = {
  _id: string;
  text: string;
  votes: number;
};

type Poll = {
  _id: string;
  question: string;
  options: Option[];
};

export default function VotingPoll() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState(""); // ✅ added 
  const [voting, setVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchPoll();
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
  }, []);

  const fetchPoll = async () => {
  try {
    const data = await getPolls();

    const currentPoll = data.polls[0];

    setPoll(currentPoll);

    // ✅ detect previous vote
    if (currentPoll.myVote) {
      setSelected(
        currentPoll.myVote.optionId
      );

      setHasVoted(true);
    }

  } catch (err) {
    console.error(err);
  }
};
  if (!poll) return null;

  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + (opt.votes || 0),
    0
  );

  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  // post & change vote 
  const handleOptionSelect = async (optionId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!poll) return;

    setSelected(optionId);

    if (!hasVoted) {
      // ✅ FIRST TIME → CREATE VOTE 
      setVoting(true);
      await createVote(poll._id, optionId);
      setVoting(false);
      setHasVoted(true);

      console.log("Vote created");

    } else {
      // ✅ OPTION CHANGED → CHANGE VOTE
      await changeVote(poll._id, optionId);

    }

    // Refresh poll results
    await fetchPoll();

    setShowResults(true);

  } catch (err) {
    console.error(err);
    alert("Vote error");
  }
};

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white">
      {/* Header */}
      <div className="bg-black text-white text-sm font-semibold px-3 py-2 mb-4">
        VOTING POLL
      </div>

      {/* Question */}
      <h3 className="font-semibold mb-2">{poll.question}</h3>

      {/* Total Votes */}
      <p className="text-center text-gray-600 mb-4 dark:text-gray-300">
        Total vote: {totalVotes}
      </p>

      {/* OPTIONS */}
      <div className="space-y-5">
        {poll.options.map((opt) => {
          const percentage =
            totalVotes === 0
              ? 0
              : Math.round((opt.votes / totalVotes) * 100);

          const isWinner = opt.votes === maxVotes && maxVotes !== 0;

          return (
            <div key={opt._id}>
              {/* Option Text */}
              <div className="flex items-center gap-4">
                {/* ✅ show radio only before results */}
                {!showResults && (
                  <input disabled={voting}
  type="radio"
  name="vote"
  value={opt._id}
  checked={selected === opt._id}
  onChange={() => handleOptionSelect(opt._id)}
/>
                )}

                <p className="mb-1">{opt.text}</p>
              </div>

              {/* Bar */}
              <div className="relative w-full bg-black h-2 rounded">
                {showResults && (
                  <div
                    className={`h-2 rounded ${
                      isWinner ? "bg-red-500" : "bg-black"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Percentage Badge */}
                {showResults && (
                  <span
                    className="absolute -top-6 text-xs bg-black text-white px-2 py-1 rounded"
                    style={{
                      left:
                        percentage === 0
                          ? "5%"
                          : percentage === 100
                          ? "95%"
                          : `${percentage}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    {percentage}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BUTTONS */}
      <div className="mt-5">
        {!showResults ? (
          <div className="flex gap-4">
            {!isLoggedIn && (
              <button
                onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                className="bg-red-500 text-white px-4 py-2 rounded mr-5"
              >
                Login
              </button>
            )}

            <button
              onClick={() => setShowResults(true)}
              className="bg-transparent text-slate-950 font-medium text-xl dark:text-white"
            >
              View results
            </button>
          </div>
        ) : (
          <button
            className="font-semibold text-lg cursor-pointer dark:text-white"
            onClick={() => setShowResults(false)}
          >
            View options
          </button>
        )}
      </div>
    </div>
  );
}