"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaArrowUp,
  FaTimes,
} from "react-icons/fa";
import { getCategories } from "@/services/categoryService";

export default function Footer() {
  const [showButton, setShowButton] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="relative bg-gray-50 text-gray-900 dark:bg-[#0a0a0a] dark:text-white mt-16 border-t border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-black dark:via-[#0a0a0a] dark:to-black opacity-95"></div>

        <div className="relative w-full max-w-[1360px] mx-auto px-6 py-14">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10">
            <Link href="/" className="text-4xl font-black tracking-tight flex items-center transition-transform hover:scale-[1.02] duration-300">
              <span className="text-black dark:text-white">Epo</span>
              <span className="text-[#e43f3e]">Verse.</span>
            </Link>

            <div className="flex gap-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map(
                (Icon, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-full hover:border-[#e43f3e] hover:text-[#e43f3e] dark:hover:border-[#e43f3e] dark:hover:text-[#e43f3e] transition cursor-pointer"
                  >
                    <Icon />
                  </div>
                )
              )}
            </div>
          </div>

          <hr className="border-gray-300 dark:border-gray-800 mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-6 md:border-r md:border-gray-300 md:dark:border-gray-800 md:pr-8">
              <h3 className="text-xl font-bold tracking-wide text-black dark:text-white">About Us</h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Epoverse is your premier source for the latest news on technology, health, finance, and global events.
              </p>

              <div className="space-y-4 text-gray-600 dark:text-gray-400 text-sm mt-4 font-medium">
                <p className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#e43f3e] shrink-0" />
                  <span>Hindupur, Andhra Pradesh</span>
                </p>
                <p className="flex items-center gap-3">
                  <FaPhoneAlt className="text-[#e43f3e] shrink-0" />
                  <span>+91 98765 43210</span>
                </p>
                <p className="flex items-center gap-3 w-full !break-words max-w-full overflow-hidden text-clip whitespace-normal pr-4">
                  <FaEnvelope className="inline-block text-[#e43f3e] shrink-0 align-middle min-w-[16px]" />
                  <span className="break-all inline-block w-[calc(100%-25px)] leading-tight align-middle text-gray-600 dark:text-gray-400 hover:text-[#e43f3e] dark:hover:text-[#e43f3e] transition-colors cursor-pointer" title="hello@epoverse.com">
                    hello@epoverse.com
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-6 md:border-r md:border-gray-300 md:dark:border-gray-800 md:px-8">
              <h3 className="text-xl font-bold tracking-wide text-black dark:text-white">Categories</h3>

              <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-400 text-sm font-medium">
                {categories.map((cat: any) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    className="hover:text-[#e43f3e] dark:hover:text-[#e43f3e] transition-all duration-300 hover:translate-x-1 cursor-pointer capitalize w-fit"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-6 md:border-r md:border-gray-300 md:dark:border-gray-800 md:px-8">
              <h3 className="text-xl font-bold tracking-wide text-black dark:text-white">Company</h3>

              <div className="flex flex-col gap-3 text-gray-600 dark:text-gray-400 text-sm font-medium">
                <button onClick={() => setShowPrivacyModal(true)} className="text-left hover:text-[#e43f3e] dark:hover:text-[#e43f3e] transition-all duration-300 hover:translate-x-1 cursor-pointer w-fit">Privacy and Policies</button>
                <button onClick={() => setShowTermsModal(true)} className="text-left hover:text-[#e43f3e] dark:hover:text-[#e43f3e] transition-all duration-300 hover:translate-x-1 cursor-pointer w-fit">Terms of Service</button>
              </div>
            </div>

            <div className="space-y-6 md:pl-8">
              <h3 className="text-xl font-bold tracking-wide text-black dark:text-white">
                Newsletter
              </h3>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Subscribe to our newsletter to get our newest articles instantly delivered to your inbox!
              </p>

              <div className="flex mt-4 shadow-sm rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <input
                  type="email"
                  placeholder="Email address..."
                  className="w-full px-4 py-3 text-black dark:text-white bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                />
                <button
                  type="button"
                  className="bg-[#e43f3e] hover:bg-red-600 px-5 py-3 font-semibold transition text-white text-sm"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 dark:border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 dark:text-gray-400 gap-4">
            <p className="text-center sm:text-left font-medium">Designed and developed by Krishlabs</p>
            <div className="flex gap-4 font-medium">
              <div>Business</div>
            </div>
          </div>
        </div>

        {showButton && (
          <button
            type="button"
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-[#e43f3e] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 z-50 text-white cursor-pointer"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </button>
        )}
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPrivacyModal(false)}></div>
          <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Privacy Policy</h2>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#e43f3e] hover:text-white transition-colors transition-transform hover:scale-110 text-gray-500 dark:text-gray-400"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto prose dark:prose-invert prose-red max-w-none 
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 [&>*:first-child]:mt-0
                            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed">
              <h3>1. Information We Collect</h3>
              <p>We believe in transparency. When you visit Epoverse, we might collect basic information to improve your reading experience. This includes information you directly provide to us (such as joining our newsletter) and automatically collected technical data (such as browser type or IP address) through cookies.</p>

              <h3>2. How We Use Your Information</h3>
              <p>Your data is used specifically to personalize your editorial feed, improve website performance, and send you our curated newsletter content. We use analytics carefully to understand which stories our community loves the most so we can deliver better journalism.</p>

              <h3>3. Cookies and Tracking Technologies</h3>
              <p>Epoverse uses cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

              <h3>4. Third-Party Services</h3>
              <p>We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks.</p>

              <h3>5. Security of Data</h3>
              <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>


            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] rounded-b-xl flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="bg-[#e43f3e] text-white px-6 py-2.5 rounded-md font-bold text-sm tracking-wide shadow-md hover:bg-red-600 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTermsModal(false)}></div>
          <div className="relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fadeIn">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Terms of Service</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#e43f3e] hover:text-white transition-colors transition-transform hover:scale-110 text-gray-500 dark:text-gray-400"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto prose dark:prose-invert prose-red max-w-none
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4 [&>*:first-child]:mt-0
                            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed text-sm lg:text-base">
              <h3>1. Agreement to Terms</h3>
              <p>By accessing or using the Epoverse website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any part of these terms, you may not access our editorial content or platform services.</p>

              <h3>2. Intellectual Property Rights</h3>
              <p>Other than the content you own, under these Terms, Epoverse and/or its licensors own all the intellectual property rights and materials contained in this Website. All editorial articles, photography, graphics, and layout design are protected by international copyright laws. You are granted a limited license only for viewing the material contained on this Website.</p>

              <h3>3. User Restrictions</h3>
              <p>You are specifically restricted from all of the following:</p>
              <ul>
                <li>Publishing any Website material in any other media without proper attribution</li>
                <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
                <li>Publicly performing and/or showing any Website material</li>
                <li>Using this Website in any way that is or may be damaging to this Website</li>
                <li>Using this Website in any way that impacts user access to this Website</li>
              </ul>

              <h3>4. Content Quality and Accuracy</h3>
              <p>While we strive for the highest journalistic standards, Epoverse is provided "as is," with all faults, and we express no representations or warranties, of any kind related to our Website or the materials contained on this Website. Information may be updated without notice.</p>

              <h3>5. Governing Law</h3>
              <p>These Terms will be governed by and interpreted in accordance with the laws of the jurisdiction of Epoverse's operational headquarters, and you submit to the non-exclusive jurisdiction of the state and federal courts located therein for the resolution of any disputes.</p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-2.5 rounded-md font-bold text-sm tracking-wide transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}