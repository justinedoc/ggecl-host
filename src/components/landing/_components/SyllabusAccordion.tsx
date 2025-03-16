import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface SyllabusItem {
  title: string;
  topics: string[];
  time: string;
}

const syllabusData: SyllabusItem[] = [
  {
    title: "Introduction to UX Design",
    topics: ["What is UX?", "History of UX", "UX vs UI", "Importance of UX"],
    time: "1 Hour",
  },
  {
    title: "User Research",
    topics: [
      "Understanding Users",
      "Conducting Surveys",
      "User Personas",
      "Competitor Analysis",
    ],
    time: "1 Hour",
  },
  {
    title: "Prototyping & Wireframing",
    topics: [
      "Low-fidelity Prototypes",
      "Wireframing Basics",
      "Usability Testing",
      "Iterative Design",
    ],
    time: "1 Hour",
  },
  {
    title: "Advanced UX Strategies",
    topics: [
      "A/B Testing",
      "Accessibility in UX",
      "Emotional Design",
      "Future of UX",
    ],
    time: "1 Hour",
  },
];

const SyllabusAccordion: React.FC = () => {
  return (
    <section>
      <header>
        <h1 className="text-xl font-bold">Syllabus</h1>
      </header>
      <div className="w-full overflow-x-auto my-6">
        <Accordion
          type="multiple"
          className="min-w-[32rem] max-w-[40rem] border dark:border-blue-300/30 rounded-md p-3"
        >
          {syllabusData.map((syllabus) => (
            <AccordionItem key={syllabus.title} value={syllabus.title}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex justify-between w-full px-4">
                  <h3 className="font-bold text-base">{syllabus.title}</h3>

                  <p className="flex h-[3vh] items-center gap-2 font-semibold text-gray-500 text-sm">
                    <span>{syllabus.topics.length} Lessons</span>
                    <Separator orientation="vertical" />
                    <span>{syllabus.time}</span>
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                {syllabus.topics.map((topic) => (
                  <p className="space-y-3 font-semibold" key={topic}>
                    {topic}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default SyllabusAccordion;
