import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dummyGroups, dummyEvents } from "@/lib/dummy-data";
import { ArrowLeft, Users, Calendar, Copy, Plus } from "lucide-react";

interface PageProps {
  params: {
    groupId: string;
  };
}

export default function GroupDetailPage({ params }: PageProps) {
  const group = dummyGroups.find((g) => g.id === params.groupId);
  const events = dummyEvents.filter((e) => e.group_id === params.groupId);

  if (!group) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href="/test-groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">모임을 찾을 수 없습니다</h2>
            <p className="text-muted-foreground">요청한 모임 ID: {params.groupId}</p>
            <Button asChild>
              <Link href="/test-groups">모임 목록으로</Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* 헤더 섹션 */}
      <section className="border-b bg-muted/50 px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4 h-9 w-9"
            asChild
          >
            <Link href="/test-groups">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{group.name}</h1>
              <p className="text-muted-foreground">{group.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {group.member_count}/{group.max_members}명
                </span>
              </div>
              <Button size="sm" variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">초대 링크</span>
                <span className="sm:hidden">초대</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 이벤트 섹션 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">이벤트</h2>
            <Button size="sm" asChild>
              <Link href={`/test-groups/${params.groupId}/events/new`}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">이벤트 만들기</span>
                <span className="sm:hidden">추가</span>
              </Link>
            </Button>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/test-groups/${params.groupId}/events/${event.id}`}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                          <CardDescription className="line-clamp-1">
                            {event.description}
                          </CardDescription>
                        </div>
                        {event.fee > 0 && (
                          <Badge variant="secondary">{event.fee.toLocaleString()}원</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.date} {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.participant_count}/{event.max_participants}명
                          {event.waiting_count > 0 && ` (대기 ${event.waiting_count})`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">📍 {event.location}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <h3 className="text-lg font-semibold mb-2">예정된 이벤트가 없습니다</h3>
                <p className="text-muted-foreground mb-6">
                  새로운 이벤트를 만들어보세요
                </p>
                <Button asChild>
                  <Link href={`/test-groups/${params.groupId}/events/new`}>
                    이벤트 만들기
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
