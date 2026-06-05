"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dummyEvents, dummyGroups, dummyParticipants } from "@/lib/dummy-data";
import { ArrowLeft, Calendar, MapPin, Users, Share2, CheckCircle2, Edit2, Trash2 } from "lucide-react";

interface Event {
  id: string;
  group_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: number;
  participant_count: number;
  waiting_count: number;
  fee: number;
  carpool_enabled: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  max_members: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface Participant {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  fee_paid: boolean;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string;
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        // localStorage 데이터도 함께 전송
        const customEvents = JSON.parse(localStorage.getItem("customEvents") || "[]");
        const url = new URL(`/api/events/${eventId}`, window.location.origin);
        url.searchParams.append('customEvents', JSON.stringify(customEvents));
        const response = await fetch(url.toString());
        if (response.ok) {
          const data = await response.json();
          setEvent(data.event);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("이벤트 로드 오류:", error);
      }

      // API 실패 시 localStorage에서 직접 찾기
      try {
        const customEvents = JSON.parse(localStorage.getItem("customEvents") || "[]");
        const foundEvent = customEvents.find((e: Event) => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("localStorage 읽기 오류:", e);
      }

      setEvent(undefined);
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  const handleDelete = async () => {
    if (!event || !confirm("정말로 이 이벤트를 삭제하시겠습니까?")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("이벤트를 삭제할 수 없습니다");
      }

      // localStorage에서도 삭제
      try {
        const customEvents = JSON.parse(localStorage.getItem("customEvents") || "[]");
        const filteredEvents = customEvents.filter((e: Event) => e.id !== event.id);
        localStorage.setItem("customEvents", JSON.stringify(filteredEvents));
      } catch (e) {
        console.error("localStorage 업데이트 오류:", e);
      }

      alert("이벤트가 삭제되었습니다");
      router.push(`/protected/groups/${groupId}`);
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("이벤트를 삭제할 수 없습니다");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href={`/protected/groups/${groupId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">로드 중...</p>
        </section>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href={`/protected/groups/${groupId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">이벤트를 찾을 수 없습니다</h2>
            <Button asChild>
              <Link href={`/protected/groups/${groupId}`}>
                모임으로 돌아가기
              </Link>
            </Button>
          </div>
        </section>
      </main>
    );
  }

  // 그룹 정보 조회 (dummyGroups 또는 localStorage)
  let group = dummyGroups.find((g) => g.id === groupId) as Group | undefined;
  if (!group) {
    try {
      const customGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
      group = customGroups.find((g: Group) => g.id === groupId);
    } catch (e) {
      console.error('localStorage 읽기 오류:', e);
    }
  }
  const participants = dummyParticipants.filter((p) => p.event_id === eventId) as Participant[];

  if (!event || !group) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href={`/protected/groups/${groupId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">이벤트를 찾을 수 없습니다</h2>
            <Button asChild>
              <Link href={`/protected/groups/${groupId}`}>
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
            <Link href={`/protected/groups/${groupId}`}>
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
                disabled={event.participant_count >= event.max_participants}
              >
                {event.participant_count >= event.max_participants ? "참가 불가" : "참가 신청"}
              </Button>
              <Button variant="outline" className="h-10 sm:h-9">
                <Share2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">공유</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 sm:h-9"
                asChild
              >
                <Link href={`/protected/groups/${groupId}/events/${eventId}/edit`}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">수정</span>
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="h-10 sm:h-9"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  {deleting ? "삭제 중..." : "삭제"}
                </span>
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
