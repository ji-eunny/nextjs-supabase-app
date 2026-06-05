import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dummyGroups } from "@/lib/dummy-data";
import { Plus, Users, Calendar } from "lucide-react";

export default function GroupsPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* 헤더 섹션 */}
      <section className="border-b bg-muted/50 px-4 py-6 sm:px-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">내 모임</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {dummyGroups.length}개의 모임에 가입되어 있습니다
              </p>
            </div>
            <Button className="w-full sm:w-auto h-10 sm:h-9" asChild>
              <Link href="/test-groups/new">
                <Plus className="mr-2 h-4 w-4" />
                새 모임
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 모임 목록 */}
      <section className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {dummyGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyGroups.map((group) => (
                <Link key={group.id} href={`/test-groups/${group.id}`}>
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
                            <p className="text-xs text-muted-foreground">
                              {new Date(group.next_event_at).toLocaleDateString('ko-KR', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <h2 className="text-xl font-semibold mb-2">아직 모임이 없습니다</h2>
              <p className="text-muted-foreground text-center mb-6">
                새로운 모임을 만들거나 초대 링크로 가입하세요
              </p>
              <Button asChild>
                <Link href="/test-groups/new">새 모임 만들기</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
