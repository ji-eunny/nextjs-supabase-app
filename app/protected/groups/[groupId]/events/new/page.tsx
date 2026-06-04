import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function NewEventPage({ params }: PageProps) {
  const { groupId } = await params;

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
          <h1 className="text-xl sm:text-2xl font-bold">새 이벤트 만들기</h1>
        </div>
      </section>

      {/* 폼 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>이벤트 정보</CardTitle>
              <CardDescription>
                새로운 이벤트를 만들기 위해 정보를 입력하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">이벤트명</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="이벤트명을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea
                    id="description"
                    placeholder="이벤트에 대해 설명해주세요"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">날짜</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">시간</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">장소</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="장소를 입력하세요"
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee">참가비</Label>
                    <Input
                      id="fee"
                      type="number"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button className="flex-1 h-10 sm:h-9" type="submit">
                    만들기
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 sm:h-9"
                    asChild
                  >
                    <Link href={`/protected/groups/${groupId}`}>
                      취소
                    </Link>
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
