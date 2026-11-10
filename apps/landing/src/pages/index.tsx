import { appUrls } from "@rexolute/utils/app-urls";
import React, { Fragment } from "react";

import { ArrowRight } from "lucide-react";
import { Accessibility, Users, Calendar } from "lucide-react";

import Head from "@rexolute/ui/head";

const Page = () => {
  return (
    <Fragment>
      <Head title="Home" />

      {/* HERO */}
      <section className="w-full bg-white min-h-screen  ">
        <div className="container ">
          <div className="relative flex justify-center py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-start">
                <div className="mt-6 space-y-2">
                  <svg
                    className="h-[45px] w-[45px]"
                    viewBox="0 0 42 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 0L24.0696 13.5893L35.8492 6.15076L28.4107 17.9304L42 21L28.4107 24.0696L35.8492 35.8492L24.0696 28.4107L21 42L17.9304 28.4107L6.15076 35.8492L13.5893 24.0696L0 21L13.5893 17.9304L6.15076 6.15076L17.9304 13.5893L21 0Z"
                      fill="#253538"
                    />
                  </svg>

                  <h1 className="text-5xl font-extrabold text-gray-800">
                    Your Journey To A
                  </h1>
                  <h1 className="text-5xl font-extrabold text-gray-800">
                    Better{" "}
                    <span style={{ color: "#AD8616" }}>Mental Wellness</span>
                  </h1>
                  <h1 className="text-5xl font-extrabold text-gray-800">
                    Starts Here
                  </h1>
                </div>

                <div className="flex flex-col space-y-1 my-6">
                  <p className="text-sm text-gray-700 max-w-md">
                    Find professional therapy services online,
                  </p>
                  <p className="text-sm text-gray-700 max-w-md">
                    anytime, anywhere.
                  </p>
                </div>

                <a href={`${appUrls.client}/login`} className="bg-primary flex items-center gap-2 px-6 py-3 rounded-full text-white transition-colors duration-300 hover:brightness-90 mt-6">
                  Book a therapist <ArrowRight size={20} />
                </a>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-full w-full">
                  <img
                    src="/images/pic1.jpg"
                    alt="Therapy Illustration"
                    width={600}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
            <svg
              className="absolute h-[140px] w-[140px] bottom-0 top-auto "
              viewBox="0 0 173 173"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M86.5 0L86.5167 86.4149L119.602 6.58439L86.5481 86.4282L147.665 25.3353L86.5718 86.4519L166.416 53.3977L86.5851 86.4833L173 86.5L86.5851 86.5167L166.416 119.602L86.5718 86.5481L147.665 147.665L86.5481 86.5718L119.602 166.416L86.5167 86.5851L86.5 173L86.4833 86.5851L53.3977 166.416L86.4519 86.5718L25.3353 147.665L86.4282 86.5481L6.58439 119.602L86.4149 86.5167L0 86.5L86.4149 86.4833L6.58439 53.3977L86.4282 86.4519L25.3353 25.3353L86.4519 86.4282L53.3977 6.58439L86.4833 86.4149L86.5 0Z"
                stroke="#1A4007"
                strokeOpacity="0.72"
                strokeWidth="2.01946"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="w-full ">
        <div className="container">
          <div className="flex flex-row py-16">
            <div className="flex justify-start md:w-1/2">
              <img
                src="/images/pic2.jpg"
                alt="Mental Wellness Visual"
                width={800}
                height={600}
                className="rounded-lg object-cover w-full max-w-md"
              />
            </div>

            <div className="flex flex-col md:w-1/2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                Why therapy is important for you
              </h1>

              <div className="text-gray-700 text-sm leading-relaxed space-y-2 mb-6">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>Quisquam quidem, voluptatum voluptas facilis soluta!</p>
                <p>Nam libero tempore, cum soluta nobis est eligendi.</p>
                <p>Temporibus autem quibusdam et aut officiis debitis.</p>
                <p>Et harum quidem rerum facilis est et expedita distinctio.</p>
              </div>

              <div className="space-y-3">
                {[
                  "Manage stress and anxiety",
                  "Improve mood and self-esteem",
                  "Cope with life's challenges and transitions",
                  "Build healthier relationships",
                  "Develop skills for better communication and problem-solving",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {/* Gold tick */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#AD8616"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>

                    {/* Text */}
                    <p className="font-semibold text-gray-800">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="w-full">
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] mt-12 mb-16">
          <div className="flex w-full">
            <img
              src="/images/pic3.png"
              alt="Visual 1"
              width={0}
              height={0}
              sizes="33vw"
              className="w-1/3 h-auto object-cover"
            />
            <img
              src="/images/pic4.png"
              alt="Visual 2"
              width={0}
              height={0}
              sizes="33vw"
              className="w-1/3 h-auto object-cover"
            />
            <img
              src="/images/pic5.png"
              alt="Visual 3"
              width={0}
              height={0}
              sizes="33vw"
              className="w-1/3 h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="w-full">
        <div className="container">
          {/* Left side text */}

          <div className="flex py-16">
            <div className="md:w-1/2 space-y-8">
              <h1 className="text-4xl font-extrabold text-black">
                Why you should choose us.
              </h1>

              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <br />
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua.
              </p>

              <div className="space-y-6">
                {/* Accessibility */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-black">
                    <Accessibility className="text-[#AD8616]" size={22} />
                    Accessibility
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Access professional therapy services from anywhere.
                    <br />
                    Anytime you need it most.
                  </p>
                </div>

                {/* Therapist Network */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-black">
                    <Users className="text-[#AD8616]" size={22} />
                    Therapist Network
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Choose from a diverse network of licensed therapists.
                    <br />
                    Find your perfect match easily.
                  </p>
                </div>

                {/* Easy Booking */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-black">
                    <Calendar className="text-[#AD8616]" size={22} />
                    Easy Booking
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Book sessions at your convenience.
                    <br />
                    Flexible times for your busy schedule.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side image */}
            <div className="md:w-1/2 flex justify-end">
              <img
                src="/images/pic6.jpg"
                alt="Next Visual"
                width={800}
                height={600}
                className="rounded-lg object-cover w-[600px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="w-full bg-[#2E8902]">
        <div className="container">
          <div className="py-16">
            {/* TOP HEADING */}
            <div className="text-center mb-14">
              <h2 className="text-white text-4xl font-extrabold mb-3">
                How it works?
              </h2>
              <p className="text-white/80 text-base max-w-xl mx-auto">
                step-by-step guide to using the service
              </p>
            </div>

            {/* IMAGE + STEPPER */}
            <div className="flex flex-col md:flex-row items-start gap-12">
              {/* LEFT IMAGE */}
              <div className="flex justify-start pl-20">
                <img
                  src="/images/pic7.jpg"
                  alt="How it works illustration"
                  width={500}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>

              {/* RIGHT STEPS */}
              <div className="relative flex flex-col pl-8">
                {[
                  { num: "1", title: "Choose therapy type" },
                  { num: "2", title: "Fill a brief assessment questionnaire" },
                  { num: "3", title: "Select a therapist" },
                  { num: "4", title: "Start your therapy session" },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 relative mb-10 last:mb-0"
                  >
                    {/* Vertical line behind circles */}
                    <div className="absolute left-4 top-4 w-px h-full bg-white/30"></div>

                    {/* Circle */}
                    <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full border-2 border-white text-white font-bold bg-transparent">
                      {step.num}
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="text-white text-lg font-bold mb-1">
                        {step.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="w-full">
        <div className="container">
          <div className="py-16">
            <div className="w-full px-6 mb-12">
              <p className="text-[#AD8616] font-semibold text-sm mb-2">
                USERS FEEDBACK
              </p>
              <h1 className="text-3xl font-extrabold text-gray-800">
                See what our users are saying
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              {/* FIRST BOX */}
              <div className="bg-green-50 rounded-lg p-6 flex items-start gap-6 flex-1">
                {/* QUOTATION MARK ICON */}
                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-[#2E8902]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.17 7A5.001 5.001 0 002 12c0 2.21 1.79 4 4 4 .34 0 .67-.04 1-.1V18c0 1.1.9 2 2 2h2v-2H9v-1h2v-2H9c-1.1 0-2-.9-2-2 0-1.3 1-2.4 2.24-2.73A5.002 5.002 0 007.17 7zM15.17 7A5.001 5.001 0 0010 12c0 2.21 1.79 4 4 4 .34 0 .67-.04 1-.1V18c0 1.1.9 2 2 2h2v-2h-2v-1h2v-2h-2c-1.1 0-2-.9-2-2 0-1.3 1-2.4 2.24-2.73A5.002 5.002 0 0015.17 7z" />
                  </svg>
                </div>

                {/* TEXT & STARS */}
                <div>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
                    <br />
                    Sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. <br />
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris. <br />
                    Nisi ut aliquip ex ea commodo consequat.
                  </p>

                  <div className="flex items-center mb-2 gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.385 2.46c-.785.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L3.613 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm font-bold text-gray-800">Said Hassan</p>
                </div>
              </div>

              {/* SECOND BOX */}
              <div className="bg-green-50 rounded-lg p-6 flex items-start gap-6 flex-1">
                {/* QUOTATION MARK ICON ON RIGHT */}

                <div className="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-[#2E8902]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.17 7A5.001 5.001 0 002 12c0 2.21 1.79 4 4 4 .34 0 .67-.04 1-.1V18c0 1.1.9 2 2 2h2v-2H9v-1h2v-2H9c-1.1 0-2-.9-2-2 0-1.3 1-2.4 2.24-2.73A5.002 5.002 0 007.17 7zM15.17 7A5.001 5.001 0 0010 12c0 2.21 1.79 4 4 4 .34 0 .67-.04 1-.1V18c0 1.1.9 2 2 2h2v-2h-2v-1h2v-2h-2c-1.1 0-2-.9-2-2 0-1.3 1-2.4 2.24-2.73A5.002 5.002 0 0015.17 7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-700 text-base leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
                    <br />
                    Sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. <br />
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris. <br />
                    Nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    Eleonora Morgan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA-1 */}
      <section className="w-full bg-[#2E8902]">
        <div className="container">
          <div className="py-2xl">
            <div className="bg-[#EAF3E6] rounded-lg  flex flex-col md:flex-row items-start gap-8 lg:px-xl">
              {/* Left side: Text */}
              <div className="flex-1 py-12">
                <h1 className="text-4xl font-extrabold text-black leading-tight">
                  Download the
                  <br />
                  <span className="text-[#2E8902]">Rexolute Mobile App</span>
                </h1>
                <p className="text-gray-700 mt-6 max-w-xl mb-10 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  <br />
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                  <br />
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris.
                </p>
                <div className="flex gap-4 mb-8">
                  {/* Google Play Button */}
                  <a
                    href=""
                    className="bg-black hover:bg-black/70 text-white px-8 py-2 rounded-full flex items-center transition-colors min-w-[180px]"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1.571 23.664l10.531-10.501 3.712 3.701-12.519 6.941c-.476.264-1.059.26-1.532-.011l-.192-.13zm9.469-11.56l-10.04-10.011v20.022l10.04-10.011zm6.274-4.137l4.905 2.719c.482.268.781.77.781 1.314s-.299 1.046-.781 1.314l-5.039 2.793-4.015-4.003 4.149-4.137zm-15.854-7.534c.09-.087.191-.163.303-.227.473-.271 1.056-.275 1.532-.011l12.653 7.015-3.846 3.835-10.642-10.612z" />
                    </svg>
                    <span>
                      <span className="text-[12px] block">Download on</span>
                      <span className="font-bold block">Google Play</span>
                    </span>
                  </a>

                  {/* App Store Button */}
                  <a
                    href="#"
                    className="bg-black hover:bg-black/70 text-white px-8 py-2 rounded-full flex items-center transition-colors min-w-[180px]"
                  >
                    <svg
                      className="w-8 h-8 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <span>
                      <span className="text-[12px] block">Download on</span>
                      <span className="font-bold block">App Store</span>
                    </span>
                  </a>
                </div>
              </div>

              {/* Right side: Image */}
              <div className="flex-1 flex items-end">
                <img
                  src="/images/rexolute-mock8.webp"
                  alt="Mobile App"
                  width={300}
                  height={300}
                  className="rounded-lg object-contain w-full max-w-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA-2 */}
      <section className="w-full bg-white">
        <div className="container">
          <div className="py-16">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Left side text */}
              <div className="md:w-1/2">
                <h1 className="text-4xl font-extrabold text-black leading-tight mb-4">
                  Join our team of{" "}
                  <span className="text-[#AD8616]">Expert Therapists</span>
                  <br /> today
                </h1>
                <p className="text-gray-700 mb-6 max-w-md leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  <br />
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                  <br />
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                </p>

                {/* Button */}
                <button className="mt-4 flex items-center gap-2 bg-[#2E8902] text-white px-6 py-3 rounded-full hover:bg-green-700 transition duration-300">
                  Get Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Right side image */}
              <div className="md:w-1/2 flex justify-center">
                <img
                  src="/images/pic10.png"
                  alt="Team"
                  width={400}
                  height={400}
                  className="rounded-lg object-contain w-full max-w-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
export default Page;
