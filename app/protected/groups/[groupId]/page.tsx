"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dummyEvents, dummyGroups } from "@/lib/dummy-data";
import { ArrowLeft, Users, Calendar, Copy, Plus, Edit2, Trash2 } from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
  max_members: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

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

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string;
  const [group, setGroup] = useState<Group | undefined>(undefined);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!group || !confirm('정말로 이 모임을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('모임을 삭제할 수 없습니다');
      }

      // localStorage에서도 삭제
      try {
        const customGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
        const filteredGroups = customGroups.filter((g: Group) => g.id !== group.id);
        localStorage.setItem('customGroups', JSON.stringify(filteredGroups));
      } catch (e) {
        console.error('localStorage 삭제 오류:', e);
      }

      router.push('/protected/groups');
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('모임을 삭제할 수 없습니다');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      // localStorage에서 먼저 찾기 (빠른 로드)
      let foundGroup: Group | undefined;
      let customGroups: Group[] = [];
      try {
        customGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
        foundGroup = customGroups.find((g: Group) => g.id === groupId);
      } catch (e) {
        console.error('localStorage 읽기 오류:', e);
      }

      if (!foundGroup) {
        foundGroup = dummyGroups.find((g) => g.id === groupId) as Group | undefined;
      }

      // 로컬에서 찾으면 먼저 표시
      if (foundGroup) {
        setGroup(foundGroup);
      }

      try {
        // API에서도 조회 시도 (최신 데이터를 위해)
        // localStorage 데이터 포함
        const url = new URL(`/api/groups/${groupId}`, window.location.origin);
        url.searchParams.append('customGroups', JSON.stringify(customGroups));
        const response = await fetch(url.toString());

        if (response.ok) {
          const data = await response.json();
          setGroup(data.group);
        }
      } catch (err) {
        console.error('그룹 조회 오류:', err);
      }

      // 이벤트 조회
      try {
        // localStorage 데이터도 함께 전송
        const customEvents = JSON.parse(localStorage.getItem("customEvents") || "[]");
        const url = new URL("/api/events", window.location.origin);
        url.searchParams.append('groupId', groupId);
        url.searchParams.append('customEvents', JSON.stringify(customEvents));
        const eventsResponse = await fetch(url.toString());
        let loadedEvents: Event[] = [];

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          loadedEvents = eventsData.events || [];
        } else {
          // API 실패 시 더미 데이터 사용
          const dummyGroupEvents = dummyEvents.filter((e) => e.group_id === groupId);
          loadedEvents = dummyGroupEvents as Event[];

          // localStorage의 이벤트도 추가 (새로 생성된 이벤트)
          try {
            const customGroupEvents = customEvents.filter((e: Event) => e.group_id === groupId);

            // 중복 제거 (API에서 받은 것과 localStorage의 것이 겹칠 수 있음)
            const eventIds = new Set(loadedEvents.map(e => e.id));
            customGroupEvents.forEach((e: Event) => {
              if (!eventIds.has(e.id)) {
                loadedEvents.push(e);
              }
            });
          } catch (e) {
            console.error("localStorage 읽기 오류:", e);
          }
        }

        setEvents(loadedEvents);
      } catch (err) {
        console.error('이벤트 조회 오류:', err);
        // 에러 발생 시에도 더미 데이터 사용
        const dummyGroupEvents = dummyEvents.filter((e) => e.group_id === groupId);
        setEvents(dummyGroupEvents as Event[]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href="/protected/groups">
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

  if (!group) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href="/protected/groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">모임을 찾을 수 없습니다</h2>
            <Button asChild>
              <Link href="/protected/groups">모임 목록으로</Link>
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
            <Link href="/protected/groups">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{group.name}</h1>
              <p className="text-muted-foreground">{group.description}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">최대 {group.max_members}명</span>
                </div>
                <Button size="sm" variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">초대 링크</span>
                  <span className="sm:hidden">초대</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <Link href={`/protected/groups/${groupId}/edit`}>
                    <Edit2 className="h-4 w-4" />
                    <span className="hidden sm:inline">수정</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-2"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {deleting ? '삭제 중...' : '삭제'}
                  </span>
                </Button>
              </div>
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
              <Link href={`/protected/groups/${groupId}/events/new`}>
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
                  href={`/protected/groups/${groupId}/events/${event.id}`}
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
                  <Link href={`/protected/groups/${groupId}/events/new`}>
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
