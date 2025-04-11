import { CourseCardSkeleton } from "./CourseCardSkeleton";

function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4">
      {Array.from({ length: count }, () => {
        return <CourseCardSkeleton />;
      })}
    </div>
  );
}

export default LoadingSkeleton;
