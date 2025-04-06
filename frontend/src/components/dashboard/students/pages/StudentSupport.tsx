import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaSearch, FaQuestionCircle, FaBook } from "react-icons/fa";

// Types
interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface SupportTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

// Sample data
const faqs: FaqItem[] = [
  {
    id: "1",
    question: "How do I reset my password?",
    answer:
      'You can reset your password by clicking on "Forgot Password" on the login page and following the instructions sent to your email.',
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for payment processing.",
  },
];

const supportTopics: SupportTopic[] = [
  {
    id: "1",
    title: "Getting Started Guide",
    description:
      "Learn how to set up your account and make the most of our platform.",
    icon: <FaBook className="text-blue-600 text-3xl" />,
    link: "/guides/getting-started",
  },
  {
    id: "2",
    title: "Video Tutorials",
    description: "Watch step-by-step tutorials for all our features.",
    icon: <FaQuestionCircle className="text-blue-600 text-3xl" />,
    link: "/tutorials",
  },
];

// FAQ Item Component
const FaqItem: React.FC<{ item: FaqItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
      <button
        className={`w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition ${
          isOpen ? "bg-blue-100 dark:bg-blue-900" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.question}
        <span className="font-bold text-lg">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <p>{item.answer}</p>
        </div>
      )}
    </div>
  );
};

// Support Card Component
const SupportCard: React.FC<{ topic: SupportTopic }> = ({ topic }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition">
      <div className="mb-4">{topic.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{topic.description}</p>
      <a
        href={topic.link}
        className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
      >
        Learn more →
      </a>
    </div>
  );
};

// Contact Form Component
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form className="max-w-lg mx-auto space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        />
      </div>
      <div>
        <label htmlFor="message" className="block font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Send Message
      </button>
    </form>
  );
};

// Main Support Component
const StudentSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "resources">(
    "faq"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-lg">
          Find answers to common questions, get in touch with our team, or
          explore helpful resources.
        </p>
      </header>

      <div className="mb-8">
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      <div className="flex justify-center mb-8 border-b border-gray-300 dark:border-gray-700">
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "faq"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("faq")}
        >
          FAQs
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "contact"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("contact")}
        >
          Contact Us
        </button>
        <button
          className={`px-6 py-3 text-lg font-medium ${
            activeTab === "resources"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </button>
      </div>

      <div>
        {activeTab === "faq" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            {filteredFaqs.length > 0 ? (
              <div>
                {filteredFaqs.map((faq) => (
                  <FaqItem key={faq.id} item={faq} />
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No results found for "{searchQuery}"
                </p>
                <button
                  className="text-blue-600 dark:text-blue-400 underline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "contact" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Our Support Team</h2>
            <ContactForm />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <FaEnvelope className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-lg font-semibold">Email Us</h3>
                <p>support@example.com</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Typically responds within 24 hours
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <FaPhone className="text-blue-600 text-3xl mb-4" />
                <h3 className="text-lg font-semibold">Call Us</h3>
                <p>+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Monday-Friday, 9am-5pm EST
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Helpful Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportTopics.map((topic) => (
                <SupportCard key={topic.id} topic={topic} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-100 dark:bg-blue-900 p-8 rounded-lg text-center mt-12">
        <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Our team is here to help you get the most out of our product. Don't
          hesitate to reach out.
        </p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setActiveTab("contact")}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default StudentSupport;