// import { useState } from "react";
import { FaStar, FaClock, FaUsers } from "react-icons/fa";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"; // shadcn Accordion
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // shadcn Tabs
import { Progress } from "@/components/ui/progress"; // shadcn Progress

const Video = () => {
  // const [activeTab, setActiveTab] = useState("overview");

  const courseContent = [
    {
      section: "Introduction to Digital Marketing",
      lessons: [
        "What is Digital Marketing?",
        "History & Evolution",
        "Digital vs Traditional Marketing",
        "Figma Introduction",
      ],
    },
    {
      section: "SEO Basics",
      lessons: ["SEO Fundamentals", "On-page SEO", "Off-page SEO"],
    },
    {
      section: "Content Marketing",
      lessons: ["Creating Engaging Content", "Content Strategy"],
    },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Video Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <video controls className="w-full rounded-md">
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div className="flex justify-between items-center mt-4">
              <h2 className="text-2xl font-semibold">History & Evolution</h2>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <FaClock className="text-xl" />
                <FaUsers className="text-xl" />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <h3 className="text-lg font-semibold">Course Overview</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Learn the basics of digital marketing, including SEO, content marketing,
                social media strategy, email marketing, and paid ads.
              </p>
              <div className="flex space-x-6 mt-4 text-gray-600 dark:text-gray-300">
                <span className="flex items-center space-x-1">
                  <FaClock />
                  <span>51m</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaStar className="text-yellow-500" />
                  <span>4.8</span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaUsers />
                  <span>854 students</span>
                </span>
              </div>
            </TabsContent>
            <TabsContent value="assignments">
              <p>Assignments will be shown here.</p>
            </TabsContent>
            <TabsContent value="resources">
              <p>Resources will be available here.</p>
            </TabsContent>
            <TabsContent value="reviews">
              <p>Reviews from students will be listed here.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Accordion */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Course Contents{" "}
            <span className="text-green-500 text-sm font-normal">20% Completed</span>
          </h3>
          <Progress value={20} className="mb-4" />
          <Accordion type="multiple" className="space-y-4">
            {courseContent.map((content, index) => (
              <AccordionItem key={index} value={`section-${index}`}>
                <AccordionTrigger>{content.section}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {content.lessons.map((lesson, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Video;