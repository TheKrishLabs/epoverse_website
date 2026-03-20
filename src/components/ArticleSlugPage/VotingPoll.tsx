"use client";

import { useEffect, useState } from "react";
import { getPolls } from "@/services/pollService";
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

  const router = useRouter();

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    try {
      const data = await getPolls();
      setPoll(data.polls[0]);
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

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      {/* Header */}
      <div className="bg-black text-white text-sm font-semibold px-3 py-2 mb-4">
        VOTING POLL
      </div>

      {/* Question */}
      <h3 className="font-semibold mb-2">{poll.question}</h3>

      {/* Total Votes */}
      <p className="text-center text-gray-600 mb-4">
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
                  <input
                    type="radio"
                    name="vote"
                    value={opt._id}
                    checked={selected === opt._id}
                    onChange={() => setSelected(opt._id)}
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
            <button
              onClick={() => router.push("/login")}
              className="bg-red-500 text-white px-4 py-2 rounded mr-5"
            >
              Login
            </button>

            <button
              onClick={() => setShowResults(true)}
              className="bg-transparent text-slate-950 font-medium text-xl"
            >
              View results
            </button>
          </div>
        ) : (
          <button
            className="font-semibold text-lg cursor-pointer"
            onClick={() => setShowResults(false)}
          >
            View options
          </button>
        )}
      </div>
    </div>
  );
}