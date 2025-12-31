// app/portfolio/[mode]/page.tsx
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import dbConnect from "@/lib/dbConnect";
import { Info } from "@/models/Info.models";
import "@/models/Project.models";
import PortfolioForm from "@/components/PortfolioForm";
import Link from "next/link";

export default async function PortfolioPage({ params }: { params: Promise<{ mode: string }> }) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/signin");
  }

  await dbConnect();
  const { mode } = await params;

  // Fetch existing portfolio for edit mode
  let portfolio = null;
  if (mode === "edit") {
    portfolio = await Info.findOne({ createdBy: user._id }).populate("projects");

    if (!portfolio) {
      redirect("/portfolio/create");
    }
  }

  // Convert Mongoose doc to plain object
  const portfolioData = portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Navigation Bar */}
        <nav className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <svg 
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <PortfolioForm initialData={portfolioData} mode={mode} />
      </div>
    </div>
  );
}