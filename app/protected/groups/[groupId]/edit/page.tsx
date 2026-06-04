"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { dummyGroups } from "@/lib/dummy-data";

interface Group {
  id: string;
  name: string;
  description: string;
  max_members: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export default function EditGroupPage() {
  const params = useParams();
  const groupId = params?.groupId as string;
  const [group, setGroup] = useState<Group | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_members: 20,
  });

  useEffect(() => {
    if (!groupId) return;

    // dummyGroups에서 먼저 찾기
    let foundGroup = dummyGroups.find((g) => g.id === groupId) as Group | undefined;

    // localStorage에서 찾기 (새로 생성된 그룹)
    if (!foundGroup) {
      try {
        const customGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
        foundGroup = customGroups.find((g: Group) => g.id === groupId);
      } catch (e) {
        console.error('localStorage 읽기 오류:', e);
      }
    }

    if (foundGroup) {
      setGroup(foundGroup);
      setFormData({
        name: foundGroup.name,
        description: foundGroup.description,
        max_members: foundGroup.max_members,
      });
    }
    setLoading(false);
  }, [groupId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('모임을 수정할 수 없습니다');
      }

      // localStorage에도 업데이트
      try {
        const customGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
        const index = customGroups.findIndex((g: Group) => g.id === group.id);
        if (index !== -1) {
          customGroups[index] = { ...group, ...formData };
          localStorage.setItem('customGroups', JSON.stringify(customGroups));
        }
      } catch (e) {
        console.error('localStorage 업데이트 오류:', e);
      }

      alert('모임이 수정되었습니다');
      window.location.href = `/protected/groups/${group.id}`;
    } catch (error) {
      console.error('수정 오류:', error);
      alert('모임을 수정할 수 없습니다');
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
              <Link href="/protected/groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">모임 수정</h1>
          </div>
        </section>
        <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <p className="text-muted-foreground">로드 중...</p>
        </section>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
              <Link href="/protected/groups">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">모임 수정</h1>
          </div>
        </section>
        <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
          <p className="text-muted-foreground">모임을 찾을 수 없습니다</p>
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
            <Link href={`/protected/groups/${groupId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">모임 수정</h1>
        </div>
      </section>

      {/* 폼 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>모임 정보</CardTitle>
              <CardDescription>
                모임의 정보를 수정하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">모임명</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="모임명을 입력하세요"
                    maxLength={50}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">최대 50자</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    placeholder="모임에 대해 설명해주세요"
                    maxLength={200}
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">최대 200자</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_members">최대 멤버 수</Label>
                  <Input
                    id="max_members"
                    type="number"
                    placeholder="20"
                    min="1"
                    max="1000"
                    value={formData.max_members}
                    onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    className="flex-1 h-10 sm:h-9"
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? '저장 중...' : '저장'}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 sm:h-9"
                    asChild
                  >
                    <Link href={`/protected/groups/${groupId}`}>취소</Link>
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
