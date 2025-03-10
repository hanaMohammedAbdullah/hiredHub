"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/HiredhubLogo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useAuth from "@/services/useAuth";

function Navbar() {
  const [header, setHeader] = useState(false);
  const { profileData, logout, role } = useAuth();
  const [nav, setNav] = useState(false);

  const profileLink = profileData?.CEO ? `/company/${profileData._id}` : "/settings/profile";

  const scrollHeader = () => {
    if (window.scrollY >= 0) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);

  const links = [
    {
      id: 1,
      link: "browsejobs",
      name: "Browse jobs",
    },
    {
      id: 4,
      link: "about",
      name: "About us",
    },
    {
      id: 5,
      link: "contact",
      name: "Contact us",
    },
  ];

  const linksMobile = [
    ...links,
    ...(role === "employer" || role === "" ? [{
      id: 3,
      link: "company/postjob",
      name: "Post job",
    }] : []),
  ];

  return (
    <nav
      className={
        "sticky top-0 z-50 flex justify-between items-center border-b-2 border-gray-200 w-full h-20 px-10 bg-[#F5F7F8]"
      }
    >
      <div>
        <Link href={"/"}>
          <div>
            <Image
              className="w-[160px]  md:m-2 md:w-[200px]"
              src={logo}
              width={150}
              height={150}
              alt="logo"
            />
          </div>
        </Link>
      </div>

      <ul className="hidden md:flex">
      {(role === "employer" || !role) && (
          <li
            key="3"
            className="nav-links xl:px-6 md:px-4 sm:px-4 cursor-pointer capitalize font-lato font-medium text-gray-600 "
          >
            <Link
              className="border-transparent border-b-2 pb-1 hover:border-b-gray-300  duration-200"
              href="/company/postjob"
            >
              Post job
            </Link>
          </li>
        )}
        {links.map(({ id, link, name }) => (
          <li
            key={id}
            className="nav-links xl:px-6 md:px-4 sm:px-4 cursor-pointer capitalize font-lato font-medium text-gray-600 "
          >
            <Link
              className="border-transparent border-b-2 pb-1 hover:border-b-gray-300  duration-200"
              href={`/${link}`}
            >
              {name}
            </Link>
          </li>
        ))}
        
      </ul>

      <div className="hidden md:flex flex-row gap-4">
        {profileData ? (
          <>
            <Link href={profileLink}>
              <button
                className="
              underline font-lato mt-2"
              >
                Profile
              </button>
            </Link>
            <Button
              onClick={logout}
              className="font-lato bg-[#263238] hover:bg-[#3f4f56]"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href={"/login"}>
              <Button className="bg-[#40A578] font-lato hover:bg-[#5abb91]">
                Log in
              </Button>
            </Link>
            <Link href={"/signup"}>
              <Button className="font-lato bg-[#263238] hover:bg-[#3f4f56]">
                Sign up
              </Button>
            </Link>
          </>
        )}
      </div>

      <div
        onClick={() => setNav(!nav)}
        className="z-40 cursor-pointer pr-4 text-gray-500 md:hidden"
      >
        {nav ? <FaTimes size={30} /> : <FaBars size={30} />}
      </div>

      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-white text-gray-500">
          {linksMobile.map(({ id, link, name }) => (
            <li
              key={id}
              className="px-4 cursor-pointer font-lato capitalize py-6 text-4xl"
            >
              <Link onClick={() => setNav(!nav)} href={`/${link}`}>
                {name}
              </Link>
            </li>
          ))}
          {profileData ? (
            <>
              <li className="px-4 cursor-pointer font-lato capitalize py-6 text-4xl underline">
                <Link onClick={() => setNav(!nav)} href={profileLink}>
                  Profile
                </Link>
              </li>
              <li className="px-4 cursor-pointer font-lato capitalize py-6 text-4xl">
                <button onClick={() => { setNav(!nav); logout(); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="px-4 cursor-pointer font-lato capitalize py-6 text-4xl">
                <Link onClick={() => setNav(!nav)} href={"/login"}>
                  Login
                </Link>
              </li>
              <li className="px-4 cursor-pointer font-lato capitalize py-6 text-4xl">
                <Link onClick={() => setNav(!nav)} href={"/signup"}>
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;