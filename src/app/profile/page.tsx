"use client";

import { useState, useEffect } from "react";
import { getBookmarks, removeBookmark } from "@/services/bookmarkService";
import Link from "next/link";
import { BookmarkX } from "lucide-react";
import { getProfileDetails, updateProfileDetails } from "@/services/profile";
import { useToast } from "@/components/ui/ToastProvider";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("bookmarks");
  const [bookmarks, setBookmarks] = useState([]);
  const { showToast } = useToast();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const details = async () => {
      try {
        const res = await getProfileDetails();
        setUser(res.profile);
      } catch (err) {
        console.log(err);
      }
    };
    const token = localStorage.getItem("token");

    if (token) details();
  }, []);

  useEffect(() => {
    if (activeTab === "bookmarks") {
      loadBookmarks();
    }
  }, [activeTab]);

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove = async (postId: string) => {
    try {
      await removeBookmark(postId);

      setBookmarks((prev: any) =>
        prev.filter((item: any) => item.postId._id !== postId),
      );

      showToast("Removed from bookmarks", "success");
    } catch {
      showToast("Error removing bookmark", "error");
    }
  };

  const updateProfile = async () => {
    showToast("Profile update coming soon...", "info");
    const updatedUser = await updateProfileDetails(user);
    setUser(updatedUser.user);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* 👤 PROFILE HEADER */}
      <div className="flex items-center gap-6 border-b pb-6">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
          {user?.fullName[0]}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{user?.fullName || "username"}</h1>
          <p className="text-gray-500">{user?.email || "email"}</p>
        </div>
      </div>

      {/* 🔘 TABS */}
      <div className="flex gap-6 mt-6 border-b">
        <button
          onClick={() => setActiveTab("articles")}
          className={`pb-2 ${activeTab === "articles"
            ? "border-b-2 border-black font-semibold"
            : "text-gray-500"
            }`}
        >
          My Articles
        </button>

        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`pb-2 ${activeTab === "bookmarks"
            ? "border-b-2 border-black font-semibold"
            : "text-gray-500"
            }`}
        >
          Saved Bookmarks
        </button>
        <button
          onClick={() => setActiveTab("update-profile")}
          className={`pb-2 ${activeTab === "update-profile"
            ? "border-b-2 border-black font-semibold"
            : "text-gray-500"
            }`}
        >
          Update Profile
        </button>
      </div>

      {/* 📚 TAB CONTENT */}
      <div className="mt-6">
        {activeTab === "articles" && (
          <p className="text-gray-500">No articles yet</p>
        )}

        {activeTab === "bookmarks" && (
          <>
            {!bookmarks.length ? (
              <p className="text-gray-500">No bookmarks yet</p>
            ) : (
              <div className="space-y-6">
                {bookmarks.map((item: any) => {
                  const post = item.postId;

                  return (
                    <div
                      key={item._id}
                      className="flex gap-4 border rounded-lg p-4 hover:shadow-md"
                    >
                      {/* Image */}
                      <Link href={`/articles/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.headline}
                          className="w-32 h-24 object-cover rounded"
                        />
                      </Link>

                      {/* Content */}
                      <div className="flex-1">
                        <Link href={`/articles/${post.slug}`}>
                          <h2 className="font-semibold text-lg hover:text-red-500 line-clamp-2">
                            {post.headline}
                          </h2>
                        </Link>

                        <p className="text-sm text-gray-500 mt-1">
                          Saved on {new Date(item.createdAt).toDateString()}
                        </p>

                        <button
                          onClick={() => handleRemove(post._id)}
                          className="flex items-center gap-1 text-sm text-red-500 mt-2"
                        >
                          <BookmarkX size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "update-profile" && (
          <div className="flex flex-col max-w-lg gap-5 bg-white dark:bg-gray-900 p-6 rounded-xl border dark:border-gray-800 shadow-sm mt-4">
            <div>
              <h2 className="text-xl font-bold dark:text-white">Profile Details</h2>
              <p className="text-gray-500 text-sm mt-1">Update your profile information.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" placeholder="Full Name"
                className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                value={user?.fullName || ""}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input type="email" placeholder="Email"
                className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                value={user?.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
              <input type="tel" placeholder="Phone Number"
                className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                value={user?.phoneNumber || ""}
                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
              />
            </div>

            <div className="mt-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm w-full md:w-auto"
                onClick={updateProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
