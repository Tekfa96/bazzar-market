import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer id="contact" className="max-padd-container">
      <div className="max-padd-container bg-black/90 text-white py-12 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href={"/"} className="bold-24 uppercase flex flex-col">
              <span>Bazzar</span>
              <span className="text-primary text-[11px] tracking-[3.5px] relative bottom-2">
                Marketplace
              </span>
            </Link>
            <p className="text-center md:text-left mt-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
              aut maxime voluptas quam tempora pariatur, eum dolore neque odio
              praesentium.
            </p>
          </div>
          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="bold-20 mb-4">Quick Links</h4>
            <ul className="space-y-2 regular-15 text-gray-30">
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Categories
                </Link>
              </li>
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Shop
                </Link>
              </li>
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* E-commerce Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="bold-20 mb-4">E-commerce Links</h4>
            <ul className="space-y-2 regular-15 text-gray-30">
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href={"/"} className="hover:text-secondary">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="bold-20 mb-4">Contact Us</h4>
            <p>
              Email:{" "}
              <a
                href="mailto:support@bazarstore.com"
                className="hover:text-secondary"
              >
                support@bazzar.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+1234567890" className="hover:text-secondary">
                +1234567890
              </a>
            </p>
            <p>Address: 123 Test Street, City, Country</p>
          </div>
        </div>
        <div className="flex flex-col items-center mt-8">
          <hr className="h-[1px] w-full max-w-screen-md my-4 border-white" />
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Bazzar | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
