import HyperText from "@/components/ui/hyper-text";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

// type Props = {};

const ContactPage = () => {
  const [email, setUserEmail] = useState("");
  return (
    <div className=" h-full w-full">
      <div className="">
        <HyperText
          className="text-4xl font-bold "
          text="Connect Me"
          duration={500}
        />
      </div>
      <Separator orientation="horizontal" className="w-full " />

      <div className="w-full flex justify-center ">
        <div className="flex items-center  dark:bg-gray-900">
          {/* https://app.web3forms.com/forms */}
          <div className="container mx-auto">
            <div className="max-w-xl mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
              <div className="text-center">
                <h1 className="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
                  Contact 
                </h1>
                <p className="text-gray-400 dark:text-gray-400">
                  Fill up the form below to send us a message.
                </p>
              </div>
              <div className="m-7">
                <form
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  id="form"
                >
                  <input
                    type="hidden"
                    name="access_key"
                    value="3c54c671-5203-4032-b520-b8f8911cc830"
                  />
                  <input
                    type="hidden"
                    name="subject"
                    value="New Submission from Portfolio"
                  />
                  <input
                    type="hidden"
                    name="from_name"
                    value="Portfolio Contact Form"
                  />
                  <input
                    type="hidden"
                    name="from_email"
                    // value={`${email}@urportfolio.com`}
                    value={email}
                  />
                  <input
                    type="checkbox"
                    name="botcheck"
                    id=""
                    style={{
                      display: "none",
                    }}
                  />
                  {/* <!-- Custom URL --> */}
                  <input
                    type="hidden"
                    name="redirect"
                    value={
                      import.meta.env.MODE === "development"
                        ? "http://localhost:3001/"
                        : "https://my-portfolio-2024.onrender.com"
                    }
                  />
                  <div className="flex mb-6 space-x-4">
                    <div className="w-full md:w-1/2">
                      <label
                        htmlFor="fname"
                        className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="first_name"
                        onChange={(e) => {
                          setUserEmail(e.target.value);
                        }}
                        placeholder="John"
                        required
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <label
                        htmlFor="lname"
                        className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="lname"
                        placeholder="Doe"
                        required
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex mb-6 space-x-4">
                    <div className="w-full md:w-1/2">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="you@company.com"
                        required
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                      />
                    </div>

                    <div className="w-full md:w-1/2">
                      <label
                        htmlFor="phone"
                        className="block text-sm mb-2 text-gray-600 dark:text-gray-400"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        placeholder="+1 (555) 1234-567"
                        required
                        className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      Your Message
                    </label>

                    <textarea
                      rows={5}
                      name="message"
                      id="message"
                      placeholder="Your Message"
                      className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <button
                      type="submit"
                      className="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
                    >
                      Send Message
                    </button>
                  </div>
                  <p
                    className="text-base text-center text-gray-400"
                    id="result"
                  ></p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
