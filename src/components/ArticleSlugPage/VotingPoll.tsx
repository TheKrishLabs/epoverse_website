"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { changeVote, createVote, getPolls } from "@/services/pollService";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";

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
  const [selected, setSelected] = useState("");
  const [voting, setVoting] = useState(false);
const [hasVoted, setHasVoted] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { showToast, showLoginPrompt } = useToast();

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

  const handleOptionSelect = async (optionId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      showLoginPrompt({
        message: "Please login to cast your vote.",
        onLogin: () => router.push(`/login?redirect=${encodeURIComponent(pathname)}`),
      });
      return;
    }

    if (!poll) return;

    setSelected(optionId);

    if (!hasVoted) {
      setVoting(true);
      await createVote(poll._id, optionId);
      setVoting(false);
      setHasVoted(true);

      console.log("Vote created");

    } else {
      await changeVote(poll._id, optionId);

    }

    await fetchPoll();

    setShowResults(true);

  } catch (err) {
    console.error(err);
    showToast("Failed to submit vote. Please try again.", "error");
  }
};

  return (
    <div className="bg-card rounded-xl p-4 border border-border text-card-foreground">
      {/* Header */}
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Voting Poll
      </h3>

      {/* Question */}
      <h4 className="font-semibold mb-3 text-sm">{poll.question}</h4>

      {/* Total Votes */}
      <p className="text-xs text-muted-foreground mb-4">
        Total votes: {totalVotes}
      </p>

      {/* OPTIONS */}
      <div className="space-y-4">
        {poll.options.map((opt) => {
          const percentage =
            totalVotes === 0
              ? 0
              : Math.round((opt.votes / totalVotes) * 100);

          const isWinner = opt.votes === maxVotes && maxVotes !== 0;

          return (
            <div key={opt._id} className="text-sm">
              {/* Option Text */}
              <div className="flex items-center gap-3 mb-1.5">
                {!showResults && (
                  <input
                    disabled={voting}
                    type="radio"
                    name="vote"
                    value={opt._id}
                    checked={selected === opt._id}
                    onChange={() => handleOptionSelect(opt._id)}
                    className="accent-primary w-3.5 h-3.5"
                  />
                )}
                <p className="leading-tight">{opt.text}</p>
              </div>

              {/* Bar */}
              <div className="relative w-full bg-secondary h-1.5 rounded-full mt-2">
                {showResults && (
                  <div
                    className={`h-1.5 rounded-full ${
                      isWinner ? "bg-[#FF4747]" : "bg-muted-foreground"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Percentage Badge */}
                {showResults && (
                  <span
                    className="absolute -top-5 text-[10px] font-bold text-muted-foreground"
                    style={{
                      left: percentage === 0 ? "0%" : percentage === 100 ? "100%" : `${percentage}%`,
                      transform: percentage === 100 ? "translateX(-100%)" : percentage === 0 ? "translateX(0)" : "translateX(-50%)",
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
      <div className="mt-6 flex gap-4">
        {!showResults ? (
          <>
            {!isLoggedIn && (
              <button
                onClick={() => showLoginPrompt({
                  message: "Please login to cast your vote.",
                  onLogin: () => router.push(`/login?redirect=${encodeURIComponent(pathname)}`),
                })}
                className="bg-[#FF4747] hover:bg-[#e43f3e] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </button>
            )}
            <button
              onClick={() => setShowResults(true)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              View results
            </button>
          </>
        ) : (
          <button
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
            onClick={() => setShowResults(false)}
          >
            View options
          </button>
        )}
      </div>
    </div>
  );
}