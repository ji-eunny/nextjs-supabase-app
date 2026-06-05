import { Header } from "@/components/layout/header";
import { dummyGroups, dummyEvents, dummyUser } from "@/lib/dummy-data";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";

export default function DemoPage() {
  return (
    <>
      <Header isAuthenticated userName={dummyUser.name} />
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-6 sm:px-6 sm:py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold">데모 - 내 모임</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {dummyGroups.length}개의 모임 목록
            </p>
          </div>
        </section>

        <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyGroups.map((group) => (
                <Link key={group.id} href={`/demo/${group.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{group.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {group.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {group.member_count}/{group.max_members}명
                        </span>
                      </div>
                      {group.next_event_title && (
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {group.next_event_title}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
