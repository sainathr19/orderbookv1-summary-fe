import { Card, CardContent } from "@/components/ui/card";

const Skeleton = () => {
  return (
    <Card className="mb-4 shadow-none border-none">
      <CardContent className="animate-pulse flex flex-col gap-5 items-center">
        <div className="h-8 bg-gray-300 rounded mb-2 w-full" />
        <div className="h-8 bg-gray-300 rounded mb-1 w-[90%]" />
        <div className="h-8 bg-gray-300 rounded mb-1 w-[60%]" />
        <div className="h-8 bg-gray-300 rounded mb-1 w-[30%]" />
        <div className="h-8 bg-gray-300 rounded mb-1 w-[10%]" />
      </CardContent>
    </Card>
  );
};

export default Skeleton;
