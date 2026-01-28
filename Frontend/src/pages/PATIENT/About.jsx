import React, { useState } from "react";
import Image from "../../components/atoms/Image";
import Button from "../../components/atoms/PatientButton";

const About = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="w-full min-h-screen pt-[12vh] pb-12 bg-[#F7FBFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="h-65 sm:h-85 md:h-105 lg:h-120 rounded-3xl shadow-md">
            <Image
              image="/images/about.jpg"
              alt="About MEDIQ"
              className="rounded-3xl"
            />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              About <span className="text-[#0097a7]">Us</span>
            </h1>

            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-700">
              Welcome to MEDI<span className="text-[#0097a7]">Q</span>
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
              At MEDIQ, we are committed to providing exceptional healthcare
              services to our community. With a team of experienced doctors and
              healthcare professionals, we focus on delivering personalized and
              compassionate care to every patient.
            </p>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Our online appointment booking system is designed to make managing
              your healthcare simple, efficient, and stress-free—so you can
              focus on what truly matters: your health.
            </p>

            {showMore && (
              <p className="mt-4 text-gray-600 leading-relaxed">
                We strive to create a safe, supportive, and inclusive
                environment where every patient feels heard and valued. Our
                dedication to quality care and trust is at the heart of
                everything we do.
              </p>
            )}

            <div className="mt-6">
              <Button
                name={showMore ? "Read Less" : "Read More"}
                click={() => setShowMore(!showMore)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
