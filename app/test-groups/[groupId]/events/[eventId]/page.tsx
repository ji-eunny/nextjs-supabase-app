import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dummyEvents, dummyGroups, dummyParticipants } from "@/lib/dummy-data";
import { ArrowLeft, Calendar, MapPin, Users, Share2, CheckCircle2 } from "lucide-react";

interface PageProps {
  params: {
    groupId: string;
    eventId: string;
  };
}

export default function EventDetailPage({ params }: PageProps) {
  const event = dummyEvents.find((e) => e.id === params.eventId);
  const group = dummyGroups.find((g) => g.id === params.groupId);
  const participants = dummyParticipants.filter((p) => p.event_id === params.eventId);

  if (!event || !group) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href={`/test-groups/${params.groupId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">이벤트를 찾을 수 없습니다</h2>
            <Button asChild>
              <Link href={`/test-groups/${params.groupId}`}>
                모임으로 돌아가기
              </Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const isFull = event.participant_count >= event.max_participants;

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
            <Link href={`/test-groups/${params.groupId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">날짜</p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">장소</p>
                  <p className="font-medium truncate">{event.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">참가자</p>
                  <p className="font-medium">
                    {event.participant_count}/{event.max_participants}
                  </p>
                </div>
              </div>
              {event.fee > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">참가비</p>
                    <p className="font-medium">{event.fee.toLocaleString()}원</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                className="flex-1 h-10 sm:h-9"
                disabled={isFull}
              >
                {isFull ? "참가 불가" : "참가 신청"}
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none h-10 sm:h-9">
                <Share2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">공유</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 상세 정보 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="participants" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="participants">참가자</TabsTrigger>
              <TabsTrigger value="info">정보</TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    참가자 ({participants.length}명)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {participants.length > 0 ? (
                    <div className="space-y-3">
                      {participants.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <span className="font-medium text-sm">참가자</span>
                          {p.fee_paid && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              납부완료
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      참가자가 없습니다
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">참가 현황</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">확정 참가자</p>
                      <p className="text-3xl font-bold">
                        {event.participant_count}명
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">대기 중</p>
                      <p className="text-3xl font-bold">{event.waiting_count}명</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">수용 가능</p>
                      <p className="text-3xl font-bold">
                        {event.max_participants - event.participant_count}명
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">이벤트 상세</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">날짜/시간</p>
                      <p className="font-medium">
                        {event.date} {event.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">장소</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                    {event.fee > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">참가비</p>
                        <p className="font-medium">
                          {event.fee.toLocaleString()}원
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
