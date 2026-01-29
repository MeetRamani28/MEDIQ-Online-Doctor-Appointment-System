import React from "react";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#dceced] px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            MEDI<span className="text-[#0097a7]">Q</span>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your trusted healthcare partner. Book appointments, consult doctors,
            and manage health effortlessly.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="hover:text-[#0097a7] cursor-pointer">Home</li>
            <li className="hover:text-[#0097a7] cursor-pointer">Services</li>
            <li className="hover:text-[#0097a7] cursor-pointer">Blogs</li>
            <li className="hover:text-[#0097a7] cursor-pointer">Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4 text-2xl text-gray-700">
            <CiFacebook className="cursor-pointer hover:text-[#0097a7]" />
            <FaInstagram className="cursor-pointer hover:text-[#0097a7]" />
            <FaTwitter className="cursor-pointer hover:text-[#0097a7]" />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()}{" "}
        <span className="text-[#0097a7] font-medium">MEDIQ</span>. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;
