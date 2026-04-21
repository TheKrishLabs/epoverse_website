"use client";

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPinterestP, FaYoutube } from "react-icons/fa";

const socialLinks = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    followers: "1.0M Followers",
    bg: "bg-[#3b5998]",
    hover: "hover:bg-[#2d4373]",
    href: "#",
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    followers: "20.0K Followers",
    bg: "bg-[#1da1f2]",
    hover: "hover:bg-[#0d8bd9]",
    href: "#",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    followers: "40.0K Followers",
    bg: "bg-[#e1306c]",
    hover: "hover:bg-[#c13584]",
    href: "#",
  },
  {
    name: "Linkedin",
    icon: FaLinkedinIn,
    followers: "3.0K Followers",
    bg: "bg-[#0077b5]",
    hover: "hover:bg-[#005e93]",
    href: "#",
  },
  {
    name: "Pinterest",
    icon: FaPinterestP,
    followers: "5 Followers",
    bg: "bg-[#bd081c]",
    hover: "hover:bg-[#a00718]",
    href: "#",
  },
  {
    name: "Youtube",
    icon: FaYoutube,
    followers: "6 Followers",
    bg: "bg-[#ff0000]",
    hover: "hover:bg-[#cc0000]",
    href: "#",
  },
];

export default function FollowUs() {
  return (
    <div>
      <div className="bg-[#333] dark:bg-[#222] text-white px-4 py-2 font-bold text-[13px] tracking-wider uppercase mb-4 shadow-sm border-l-4 border-[#e43f3e]">
        Follow Us
      </div>
      <div className="grid grid-cols-2 gap-3">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${social.bg} ${social.hover} text-white flex items-center gap-3 px-4 py-3 transition-colors group`}
          >
            <social.icon className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="min-w-0">
              <span className="block text-[13px] font-bold leading-tight">{social.name}</span>

            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
