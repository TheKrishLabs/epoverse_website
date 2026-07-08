"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const cols = [
    { label: "Sections", links: ["International", "Entertainment", "Education", "Sports", "Finance", "Technology"] },
    { label: "Company", links: ["About Us", "Our Authors", "Advertise", "Careers", "Press Kit", "Contact"] },
    { label: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Settings", "Corrections", "Editorial Standards"] },
  ];

  const handleLinkClick = (e: React.MouseEvent, linkText: string) => {
    if (linkText === "Privacy Policy") {
      e.preventDefault();
      setShowPrivacyModal(true);
    } else if (linkText === "Terms of Service") {
      e.preventDefault();
      setShowTermsModal(true);
    }
  };

  return (
    <>
      <footer className="bg-background border-t border-border overflow-hidden mt-16">
        {/* ── Top row ── */}
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-12 pb-10 flex flex-col md:flex-row gap-12 md:gap-20">
          {/* Left — tagline + newsletter */}
          <div className="flex-shrink-0 md:max-w-[260px]">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-4">
              Every world · One page
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Independent multi-author journalism covering politics, culture, technology, sports, and finance from bureaus across six continents.
            </p>
            <div className="flex gap-2">
              <input
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-secondary border border-border rounded px-3 py-2 text-xs text-card-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
              <button className="bg-[#e43f3e] hover:bg-[#c93534] text-white text-xs font-bold px-4 py-2 rounded transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>

          {/* Right — nav columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8">
            {cols.map(({ label, links }) => (
              <div key={label}>
                <p className="text-xs font-bold text-foreground mb-4">{label}</p>
                <ul className="space-y-2.5">
                  {links.map(l => (
                    <li key={l}>
                      <a href={label === "Sections" ? `/${l.toLowerCase()}` : "#"}
                         onClick={(e) => handleLinkClick(e, l)}
                         className="text-sm text-muted-foreground hover:text-[#e43f3e] transition-colors leading-none cursor-pointer">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Giant full-bleed wordmark ── */}
        <div className="overflow-hidden select-none" style={{ lineHeight: 0.82 }}>
          <p
            className="text-center whitespace-nowrap"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "20.5vw",
              letterSpacing: "-0.035em",
              lineHeight: 0.82,
            }}
          >
            <span className="text-foreground">Epo</span>
            <span className="text-[#e43f3e]">Verse.</span>
          </p>
        </div>

        {/* ── Bottom strip ── */}
        <div className="border-t border-border px-5 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span
            className="text-muted-foreground text-[12px]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            EpoVerse Media Group &nbsp;·&nbsp; © 2026
          </span>
          <div className="flex flex-wrap gap-5 justify-center sm:justify-end">
            {["Sitemap", "RSS Feed", "Accessibility", "Cookie Preferences", "Do Not Sell My Data"].map(l => (
              <a key={l} href="#" className="text-xs text-muted-foreground hover:text-[#e43f3e] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
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
              <button onClick={() => setShowPrivacyModal(false)} className="bg-[#e43f3e] text-white px-6 py-2.5 rounded-md font-bold text-sm tracking-wide shadow-md hover:bg-red-600 transition-colors">
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
              <p>While we strive for the highest journalistic standards, Epoverse is provided &quot;as is,&quot; with all faults, and we express no representations or warranties, of any kind related to our Website or the materials contained on this Website. Information may be updated without notice.</p>
              <h3>5. Governing Law</h3>
              <p>These Terms will be governed by and interpreted in accordance with the laws of the jurisdiction of Epoverse&apos;s operational headquarters, and you submit to the non-exclusive jurisdiction of the state and federal courts located therein for the resolution of any disputes.</p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] rounded-b-xl flex justify-end gap-3">
              <button onClick={() => setShowTermsModal(false)} className="bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-2.5 rounded-md font-bold text-sm tracking-wide transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}