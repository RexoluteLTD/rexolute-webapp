import React, { Fragment } from "react";
import { useRouter } from "@tanstack/react-router";
import Head from "@rexolute/ui/head";

const Page = () => {
  const router = useRouter();

  return (
    <Fragment>
      <Head title="About us" />

      <section>
        <div className="container">
          <div className="py-16">
            <div className="max-w-3xl mx-auto text-center py-12 px-6">
              <h1 className="text-5xl font-extrabold mb-6">About Rexolute</h1>
              <p className="text-gray-700 leading-relaxed space-y-4">
                Lorem ipsum dolor sit amet consectetur. Proin elit facilisis
                etiam facilisis cursus cursus mattis a. Nec egestas vitae semper
                auctor. Orci mi iaculis mauris ultricies felis velit. Nullam
                massa faucibus aenean malesuada non sed tempor. Et consectetur
                elit odio interdum nisl arcu cursus habitasse. Nam non aliquam
                lectus lobortis elit nibh. Elit cursus scelerisque nec euismod
                eu. Morbi vitae nulla pellentesque enim maecenas dui.
              </p>
            </div>
            <div className="max-w-6xl mx-auto px-6 my-12">
              <img
                src="/images/about-1.webp"
                alt="About Rexolute"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="flex gap-8 my-8">
              <div className="flex-1">
                <p className="text-[#AD8616]">OUR VISION</p>
                <h2 className="font-bold text-2xl font-berlin">
                  We are here to help the customers to get their success.
                </h2>
              </div>
              <div className="flex-1">
                <p>
                  We share common trends and strategies for improving your
                  rental income and making sure you stay in high demand of
                  service.{" "}
                </p>
                <p>
                  With lots of unique blocks, you can easily build a page
                  without coding. Build your next landing page. With lots of
                  unique blocks, you can easily build a page without coding any
                  other page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#2E8902]  ">
        <div className="container">
          <div className="py-16">
            <div className="lg:max-w-[600px] text-center mx-auto">
              <h1 className="text-5xl  text-white font-extrabold mb-6">
                Executive Leadership
              </h1>
              <p className="text-[#ffffff] leading-relaxed space-y-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center ">
              {/* Team Member 1 */}
              <div className="text-center">
                <img
                  src="/images/executives/whatever-happens-im-ready-to-face-it.jpg"
                  alt="Team Member 1"
                  className="w-42 h-42 rounded-md object-cover mx-auto mb-4"
                />
                <p className="text-white font-semibold">Dr. Jane Smith</p>
                <p className="text-gray-300 text-sm">Lead Therapist</p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <img
                  src="/images/executives/well-im-not-in-the-mood-for-any-jokes-today.jpg"
                  alt="Team Member 2"
                  className="w-42 h-42 rounded-md object-cover mx-auto mb-4"
                />
                <p className="text-white font-semibold">Mr. John Doe</p>
                <p className="text-gray-300 text-sm">Cognitive Specialist</p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <img
                  src="/images/executives/ready-for-a-date.jpg"
                  alt="Team Member 3"
                  className="w-42 h-42 rounded-md object-cover mx-auto mb-4"
                />
                <p className="text-white font-semibold">Dr. Emily Rose</p>
                <p className="text-gray-300 text-sm">Child Psychologist</p>
              </div>

              {/* Team Member 4 */}
              <div className="text-center">
                <img
                  src="/images/executives/looking-at-the-day-ahead.jpg"
                  alt="Team Member 4"
                  className="w-42 h-42 rounded-md object-cover mx-auto mb-4"
                />
                <p className="text-white font-semibold">Mr. Mark Lee</p>
                <p className="text-gray-300 text-sm">Family Counselor</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default Page;
