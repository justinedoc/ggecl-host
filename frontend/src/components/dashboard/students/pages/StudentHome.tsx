import { useEffect, useState } from "react";
import { FaClock, FaBook } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Student } from "@/types/userTypes";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { parseISO, format, isValid } from "date-fns";

// Type definitions
interface EnrolledCourse {
  id: number;
  title: string;
  duration: string;
  lessons: number;
  progress: number;
  active: boolean;
}

interface UpcomingLesson {
  id: number;
  title: string;
  time: string;
  date: string;
  duration: string;
}

interface MetricItemProps {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
}

interface AchievementItemProps {
  title: string;
  date: string;
}

interface TaskItemProps {
  title: string;
  dueDate: string;
}

const StudentHome = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(0);

  const { user } = useAuth();

  const student = user as Student;

  const enrolledCourses: EnrolledCourse[] = [
    {
      id: 1,
      title: "User Experience (UX) Design",
      duration: "5.5 hours",
      lessons: 5,
      progress: 65,
      active: true,
    },
  ];

  const upcomingLessons: UpcomingLesson[] = [
    {
      id: 1,
      title: "UX Design Fundamentals",
      time: "17:30",
      date: "2024-03-25",
      duration: "90 mins",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setProgress(65), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return null;
  }

  const firstName = student.fullName.split(" ")[1] || "Student";

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, <span className="capitalize">{firstName}</span>
        </h1>
        <p className="text-muted-foreground">
          You have 3 upcoming assignments and 2 new resources
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Current Course Progress
                </span>
                <span className="text-sm text-primary">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Enrolled Courses</h3>
              {enrolledCourses.map((course) => (
                <div key={course.id} className="p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <div className="text-sm text-muted-foreground flex gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <FaClock className="h-4 w-4" /> {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBook className="h-4 w-4" /> {course.lessons}{" "}
                          lessons
                        </span>
                      </div>
                    </div>
                    <Badge variant={course.active ? "default" : "secondary"}>
                      {course.active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent className="mx-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingLessons.map((lesson) => {
                const parsedDate = parseISO(lesson.date);
                const formattedDate = isValid(parsedDate)
                  ? format(parsedDate, "MMM d, yyyy")
                  : "Invalid date";
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-2 rounded-md bg-muted"
                  >
                    <div>
                      <p className="font-medium text-sm">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formattedDate} at {lesson.time}
                      </p>
                    </div>
                    <Button
                      className="border-border"
                      size="sm"
                      variant="outline"
                    >
                      Join
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="font-medium">Performance Metrics</h3>
            <div className="space-y-4">
              <MetricItem label="Average Grade" value="A-" trend="up" />
              <MetricItem
                label="Completed Courses"
                value="4/8"
                trend="neutral"
              />
              <MetricItem label="Study Hours" value="56h" trend="up" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Recent Achievements</h3>
            <div className="space-y-2">
              <AchievementItem title="UX Mastery" date="Mar 2024" />
              <AchievementItem title="Design Prodigy" date="Feb 2024" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Priority Tasks</h3>
            <div className="space-y-2">
              <TaskItem title="Submit Final Project" dueDate="2024-04-15" />
              <TaskItem title="Peer Review Submission" dueDate="2024-04-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricItem = ({ label, value, trend }: MetricItemProps) => (
  <div className="flex justify-between items-center p-3 rounded bg-muted">
    <span>{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-medium">{value}</span>
      <span
        className={cn(
          "text-sm",
          trend === "up" && "text-green-400",
          trend === "down" && "text-red-400",
          trend === "neutral" && "text-muted-foreground"
        )}
      >
        {trend === "up" ? "↑" : trend === "down" ? "↓" : "-"}
      </span>
    </div>
  </div>
);

const AchievementItem = ({ title, date }: AchievementItemProps) => (
  <div className="flex items-center gap-3 p-2 rounded bg-muted">
    <div
      className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center",
        "bg-primary/10 text-primary/80"
      )}
    >
      🏆
    </div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
  </div>
);

const TaskItem = ({ title, dueDate }: TaskItemProps) => {
  const parsedDueDate = parseISO(dueDate);
  const formattedDueDate = isValid(parsedDueDate)
    ? format(parsedDueDate, "MMM d, yyyy")
    : "Invalid date";

  return (
    <div className="flex justify-between items-center p-2 rounded bg-muted">
      <span className="font-semibold text-sm">{title}</span>
      <Badge variant="secondary" className="bg-secondary">
        {formattedDueDate}
      </Badge>
    </div>
  );
};

export default StudentHome;
