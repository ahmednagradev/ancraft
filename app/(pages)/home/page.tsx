// app/home/page.tsx
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import dbConnect from "@/lib/dbConnect";
import { Info } from "@/models/Info.models";
import Link from "next/link";
import ViewPortfolioButton from "@/components/ViewPortfolioButton";

export default async function HomePage() {
  // Check if user is authenticated
  const user = await getAuthenticatedUser();
  
  if (!user) {
    redirect("/signin");
  }

  await dbConnect();

  // Check if user has a portfolio
  const portfolio = await Info.findOne({ createdBy: user._id });

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user.email}</h1>

        <div className="mb-6">
          <ViewPortfolioButton />
        </div>
        
        <div className="border rounded-lg p-6">
          {portfolio ? (
            <div>
              <h2 className="text-xl mb-4">Your Portfolio</h2>
              <p className="text-gray-600 mb-6">
                You have an existing portfolio. Click below to edit it.
              </p>
              <Link
                href="/portfolio/edit"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Portfolio
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-xl mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">
                You don't have a portfolio yet. Create one to showcase your work!
              </p>
              <Link
                href="/portfolio/create"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Make Portfolio
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}