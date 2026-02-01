import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#E8F7FB_0%,#C5ECF5_50%,#9DDEED_100%)] px-4 py-16">
      <div className="w-full max-w-lg text-center flex flex-col items-center gap-8">
        {/* 404 illustration */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-8xl md:text-9xl font-bold text-sky-400 leading-none">404</span>
          <div className="flex h-24 w-24 md:h-36 md:w-36 items-center justify-center rounded-full bg-white shadow-xl">
            <span className="text-4xl md:text-6xl">🔍</span>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Page Not Found</h1>
          <p className="mx-auto max-w-md text-gray-600 md:text-lg">
            Oops! Looks like Lumi couldn&apos;t find this page. It might have been moved or
            doesn&apos;t exist anymore.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="rounded-full bg-orange-500 px-10 py-4 text-lg font-semibold text-white shadow-[0_4px_14px_rgba(239,118,47,0.4)] transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            Go Home
          </Link>

          <Link
            href="/#contact"
            className="text-sky-500 text-md font-medium hover:text-sky-600 hover:underline"
          >
            Contact Support
          </Link>
        </div>

        {/* Fun message */}
        <p className="text-sm italic text-gray-400">Even Lumi sometimes gets lost exploring!</p>
      </div>
    </div>
  );
}
