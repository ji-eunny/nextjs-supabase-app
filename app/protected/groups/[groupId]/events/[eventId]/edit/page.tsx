"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { dummyEvents } from "@/lib/dummy-data";

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

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: number;
  fee: number;
}

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string;
  const eventId = params?.eventId as string;
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    max_participants: 20,
    fee: 0,
  });

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
          const foundEvent = data.event;
          setEvent(foundEvent);
          setFormData({
            title: foundEvent.title,
            description: foundEvent.description,
            date: foundEvent.date,
            time: foundEvent.time,
            location: foundEvent.location,
            max_participants: foundEvent.max_participants,
            fee: foundEvent.fee,
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("이벤트 로드 오류:", error);
      }

      setEvent(undefined);
      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let updatedEvent = event;

      if (response.ok) {
        const data = await response.json();
        updatedEvent = data.event;
      }

      // API 성공 여부와 관계없이 localStorage 업데이트
      const updatedEventData = {
        ...event,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      try {
        const customEvents = JSON.parse(localStorage.getItem("customEvents") || "[]");
        const eventIndex = customEvents.findIndex((e: Event) => e.id === event.id);
        if (eventIndex !== -1) {
          customEvents[eventIndex] = updatedEventData;
          localStorage.setItem("customEvents", JSON.stringify(customEvents));
        } else {
          // localStorage에 없으면 추가
          customEvents.push(updatedEventData);
          localStorage.setItem("customEvents", JSON.stringify(customEvents));
        }
      } catch (e) {
        console.error("localStorage 업데이트 오류:", e);
      }

      alert("이벤트가 수정되었습니다");
      router.push(`/protected/groups/${groupId}/events/${eventId}`);
    } catch (error) {
      console.error("수정 오류:", error);
      alert("이벤트를 수정할 수 없습니다");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
              <Link href={`/protected/groups/${groupId}/events/${eventId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">이벤트 수정</h1>
          </div>
        </section>
        <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <p className="text-muted-foreground">로드 중...</p>
        </section>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
              <Link href={`/protected/groups/${groupId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">이벤트 수정</h1>
          </div>
        </section>
        <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <p className="text-muted-foreground">이벤트를 찾을 수 없습니다</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
            <Link href={`/protected/groups/${groupId}/events/${eventId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">이벤트 수정</h1>
        </div>
      </section>

      {/* 폼 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>이벤트 정보</CardTitle>
              <CardDescription>
                이벤트 정보를 수정하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="title">이벤트명</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="이벤트명을 입력하세요"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    placeholder="이벤트에 대해 설명해주세요"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">날짜</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">시간</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">장소</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="장소를 입력하세요"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">최대 참가자</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      placeholder="20"
                      min="1"
                      value={formData.max_participants}
                      onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) || 20 })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee">참가비</Label>
                    <Input
                      id="fee"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button className="flex-1 h-10 sm:h-9" type="submit" disabled={saving}>
                    {saving ? "저장 중..." : "저장"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 sm:h-9"
                    asChild
                  >
                    <Link href={`/protected/groups/${groupId}/events/${eventId}`}>취소</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
