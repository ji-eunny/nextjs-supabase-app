import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CreditCard, Share2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* 히어로 섹션 */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        <div className="max-w-2xl w-full text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              모임 관리가
              <br />
              <span className="text-primary">이렇게 쉬워도 되나요?</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              수영, 헬스, 등산 등 정기 모임의 참가자 관리부터
              <br className="hidden sm:block" />
              정산, 카풀까지 모든 것을 한 곳에서 관리하세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/auth/sign-up">
                시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/auth/login">로그인</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="w-full bg-muted/50 px-4 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">주요 기능</h2>
          <p className="text-center text-muted-foreground mb-12">
            모임 관리에 필요한 모든 기능을 한곳에서
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background rounded-lg border p-6 space-y-3">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">멤버 관리</h3>
              <p className="text-sm text-muted-foreground">
                참가자 현황을 한눈에 파악하고 관리하세요
              </p>
            </div>

            <div className="bg-background rounded-lg border p-6 space-y-3">
              <Calendar className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">일정 관리</h3>
              <p className="text-sm text-muted-foreground">
                이벤트를 쉽게 만들고 공유하세요
              </p>
            </div>

            <div className="bg-background rounded-lg border p-6 space-y-3">
              <CreditCard className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">비용 관리</h3>
              <p className="text-sm text-muted-foreground">
                참가비를 편리하게 관리하세요
              </p>
            </div>

            <div className="bg-background rounded-lg border p-6 space-y-3">
              <Share2 className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">카풀 기능</h3>
              <p className="text-sm text-muted-foreground">
                함께 이동하는 사람들을 찾아보세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold">지금 시작해보세요</h2>
          <p className="text-muted-foreground">
            무료로 가입하고 모임을 관리해보세요
          </p>
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="/auth/sign-up">
              회원가입
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 동호회 모임 관리 서비스. All rights reserved.</p>
      </footer>
    </main>
  );
}
