import { CourseCardSkeleton } from "./CardSkeleton";

function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-4">
      {Array.from({ length: count }, (_, i) => {
        return <CourseCardSkeleton key={i} />;
      })}
    </div>
  );
}

export default LoadingSkeleton;
