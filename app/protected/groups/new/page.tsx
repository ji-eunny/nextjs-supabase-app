"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

export default function NewGroupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    max_members: "20",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "모임 생성에 실패했습니다");
      }

      const data = await response.json();
      // localStorage에 새 그룹 저장
      const newGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
      newGroups.push(data.group);
      localStorage.setItem('customGroups', JSON.stringify(newGroups));

      router.push(`/protected/groups/${data.group.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <section className="border-b bg-muted/50 px-4 py-4 sm:px-6 sm:py-6">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" asChild>
            <Link href="/protected/groups">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">새 모임 만들기</h1>
        </div>
      </section>

      {/* 폼 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>모임 정보</CardTitle>
              <CardDescription>
                새로운 모임을 만들기 위해 정보를 입력하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">모임명</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="모임명을 입력하세요"
                    maxLength={50}
                    value={formData.name}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    className="flex-1 h-10 sm:h-9"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "생성 중..." : "만들기"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 sm:h-9"
                    asChild
                  >
                    <Link href="/protected/groups">취소</Link>
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
