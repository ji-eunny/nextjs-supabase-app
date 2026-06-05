"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Calendar, MapPin, Users } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface Event {
  id: string;
  group_id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  participant_count: number;
  max_participants: number;
}

const CURRENT_USER_ID = "dummy-user-id";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 정보 조회
        const userResponse = await fetch(`/api/users/${CURRENT_USER_ID}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
          setFormData({
            name: userData.user.name,
            phone: userData.user.phone || "",
            bio: userData.user.bio || "",
          });
        }

        // 사용자가 참가한 이벤트 조회
        const customEvents = JSON.parse(localStorage.getItem("customEvents") || "[]");
        const url = new URL(`/api/users/${CURRENT_USER_ID}/events`, window.location.origin);
        url.searchParams.append('customEvents', JSON.stringify(customEvents));
        const eventsResponse = await fetch(url.toString());
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events || []);
        }
      } catch (error) {
        console.error("프로필 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("프로필을 저장할 수 없습니다");
      }

      const data = await response.json();
      setUser(data.user);
      alert("프로필이 저장되었습니다");
    } catch (error) {
      console.error("저장 오류:", error);
      alert("프로필을 저장할 수 없습니다");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="flex-1 flex items-center justify-center px-4 py-20">
          <p className="text-muted-foreground">로드 중...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* 헤더 섹션 */}
      <section className="border-b bg-muted/50 px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">프로필</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 컨텐츠 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 프로필 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>개인 정보</CardTitle>
              <CardDescription>프로필 정보를 수정하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">휴대폰</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">자기소개</Label>
                  <Textarea
                    id="bio"
                    placeholder="자기소개를 입력하세요"
                    rows={4}
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                </div>

                <Button className="w-full h-10 sm:h-9" type="submit" disabled={saving}>
                  {saving ? "저장 중..." : "저장하기"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 참가한 이벤트 */}
          <Card>
            <CardHeader>
              <CardTitle>참가한 이벤트</CardTitle>
              <CardDescription>
                현재 {events.length}개의 이벤트가 있습니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-2">{event.title}</h3>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {event.date} {event.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            <span>
                              {event.participant_count}/{event.max_participants}명
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  아직 참가한 이벤트가 없습니다
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
