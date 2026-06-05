import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LayoutGrid, User, LogOut, Menu } from "lucide-react";

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export function Header({
  isAuthenticated = false,
  userName = "사용자",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              모
            </div>
            <span className="hidden sm:inline font-bold text-lg">모임</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/protected/groups"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                모임
              </Link>
              <Link
                href="/protected/profile"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                프로필
              </Link>
            </nav>
          )}

          {/* 우측 액션 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {isAuthenticated && (
              <>
                {/* 데스크톱 메뉴 */}
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm font-medium">{userName}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/auth/login">로그아웃</Link>
                  </Button>
                </div>

                {/* 모바일 메뉴 */}
                <div className="sm:hidden flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                    <Link href="/protected/profile" title="프로필">
                      <User className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 하단 네비게이션 */}
      {isAuthenticated && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="flex items-center justify-around px-4 py-2 max-w-6xl mx-auto">
            <Link
              href="/protected/groups"
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="text-xs font-medium">모임</span>
            </Link>
            <Link
              href="/protected/profile"
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">프로필</span>
            </Link>
            <Link
              href="/auth/login"
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-xs font-medium">로그아웃</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
