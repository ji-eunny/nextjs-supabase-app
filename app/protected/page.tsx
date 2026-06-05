import { dummyUser } from "@/lib/dummy-data";

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12 px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full">
        <div className="bg-primary/10 text-sm p-3 px-5 rounded-md text-foreground">
          인증된 사용자입니다: <strong>{dummyUser.name}</strong>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">사용자 정보</h2>
        <pre className="text-xs font-mono p-3 rounded border bg-muted max-w-md">
          {JSON.stringify(dummyUser, null, 2)}
        </pre>
      </div>
    </div>
  );
}
