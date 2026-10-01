import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      name: "Lightning Fast Generation",
      description:
        "Generate highly customized cold emails in seconds using state-of-the-art AI.",
      icon: BoltIcon,
    },
    {
      name: "Omnichannel Outreach",
      description:
        "Get an email, a follow-up, and a LinkedIn DM perfectly synced for your prospect.",
      icon: DocumentTextIcon,
    },
    {
      name: "Higher Conversion Rates",
      description:
        "Personalized copy helps improve open rates and increase reply opportunities.",
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation */}
      <nav className="fixed z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="bg-blue-500 from-primary-600 to-indigo-600 bg-clip-text text-2xl font-black text-transparent"
              >
                MailGen AI
              </Link>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40">
        {/* Background Gradient */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
            Write Cold Emails That
            <br className="hidden md:block" />
            <span className="bg-blue-400 from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              Actually Get Replies
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-gray-600">
            Stop wasting hours drafting outreach. Enter your prospect's
            context, and let our AI generate the perfect structured sequence.
            Email, Follow-up, and LinkedIn DM all at once.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="group inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800"
            >
              Start Generating for Free

              <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to close more deals
            </h2>

            <p className="mt-4 inline-block pb-1 text-lg text-gray-600">
              Built for sales teams who demand performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.name}
                  className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                    <Icon
                      className="h-6 w-6 text-primary-600"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    {feature.name}
                  </h3>

                  <p className="leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gray-900">
        <div className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to scale your outreach?
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join sales professionals using MailGen AI to accelerate their
              pipeline today.
            </p>

            <div className="mt-10 flex items-center justify-center">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="rounded-full bg-blue-400 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:scale-105 hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {user ? "Go to Dashboard" : "Create Free Account"}
              </Link>
            </div>
          </div>
        </div>

        {/* Background Circle */}
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle
            cx="512"
            cy="512"
            r="512"
            fill="url(#gradient)"
            fillOpacity="0.7"
          />

          <defs>
            <radialGradient id="gradient">
              <stop stopColor="#4f46e5" />
              <stop offset="1" stopColor="#818cf8" />
            </radialGradient>
          </defs>
        </svg>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-black text-transparent"
          >
            MailGen AI
          </Link>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MailGen AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;