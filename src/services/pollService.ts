import { privateApi, publicApi } from "@/lib/axios";


// ✅ Get all polls (PUBLIC)
export const getPolls = async () => {
  const res = await publicApi.get("/polls");
  return res.data; // returns full object
};

// ✅ Vote on poll (PRIVATE)
export const votePoll = async (pollId: string, optionId: string) => {
  const res = await privateApi.post("/polls", {
    pollId,
    optionId,
  });
  return res.data;
};