import Link from 'next/link';

export function TermsFooter() {
  return (
    <div className="mt-6 text-center text-sm text-muted-foreground">
      <p>
        继续使用即表示您同意我们的
        <Link href="/terms" className="text-primary hover:underline mx-1">
          服务条款
        </Link>
        和
        <Link href="/privacy" className="text-primary hover:underline mx-1">
          隐私政策
        </Link>
      </p>
    </div>
  );
}
