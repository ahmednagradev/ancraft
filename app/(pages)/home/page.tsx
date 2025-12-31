// app/home/page.tsx
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import dbConnect from "@/lib/dbConnect";
import { Info } from "@/models/Info.models";
import Link from "next/link";
import ViewPortfolioButton from "@/components/ViewPortfolioButton";
import Navigation from "@/components/Navigation";

export default async function HomePage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/signin");
  }

  await dbConnect();
  const portfolio = await Info.findOne({ createdBy: user._id });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black">
      {/* Navigation */}
      <Navigation />
      
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-2 sm:mb-3">
                Welcome back
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">{user.email}</p>
            </div>
            
            {portfolio && (
              <div className="sm:self-start">
                <ViewPortfolioButton />
              </div>
            )}
          </div>
        </header>

        {/* Main Content Card */}
        <div className="bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-800/50 shadow-2xl overflow-hidden mb-6 sm:mb-8">
          {portfolio ? (
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-emerald-400">
                  Portfolio Live
                </span>
              </div>

              {/* Portfolio Info */}
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
                  Your Portfolio
                </h2>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
                  Your portfolio is live and ready to showcase your work to the world.
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-white truncate">
                    {portfolio.fullname}
                  </p>
                </div>
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2 uppercase tracking-wider">
                    Projects
                  </p>
                  <p className="text-lg sm:text-xl font-semibold text-white">
                    {portfolio.projects.length}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/portfolio/edit"
                className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02]"
              >
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
                <span className="text-sm sm:text-base">Edit Portfolio</span>
              </Link>
            </div>
          ) : (
            <div className="p-8 sm:p-12 lg:p-16 text-center">
              {/* Icon Container */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl border border-gray-700/50 flex items-center justify-center">
                  <svg 
                    className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                Create Your Portfolio
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mb-8 sm:mb-10 max-w-md mx-auto px-4">
                You haven't created a portfolio yet. Start building your professional presence online today!
              </p>

              <Link
                href="/portfolio/create"
                className="group inline-flex items-center gap-2 sm:gap-3 px-8 sm:px-10 py-3 sm:py-4 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                <span className="text-sm sm:text-base">Create Portfolio</span>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        {portfolio && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="group bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-800/50 p-5 sm:p-6 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                  Social Links
                </p>
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
                  />
                </svg>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {portfolio.socialLinks?.length || 0}
              </p>
            </div>

            <div className="group bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-800/50 p-5 sm:p-6 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                  Projects
                </p>
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {portfolio.projects?.length || 0}
              </p>
            </div>

            <div className="group bg-linear-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-800/50 p-5 sm:p-6 hover:border-emerald-500/30 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                  Status
                </p>
                <div className="relative">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Live
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}