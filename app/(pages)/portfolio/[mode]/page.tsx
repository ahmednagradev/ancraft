// app/portfolio/[mode]/page.tsx
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/getAuthenticatedUser";
import dbConnect from "@/lib/dbConnect";
import { Info } from "@/models/Info.models";
import "@/models/Project.models";
import PortfolioForm from "@/components/PortfolioForm";

export default async function PortfolioPage({ params }: { params: Promise<{ mode: string }> }) {
  const user = await getAuthenticatedUser();
  console.log(user)

  if (!user) {
    redirect("/signin");
  }

  await dbConnect();
  const { mode } = await params;

  // Fetch existing portfolio for edit mode
  let portfolio = null;
  if (mode === "edit") {
    portfolio = await Info.findOne({ createdBy: user._id }).populate("projects");
    console.log(portfolio)

    if (!portfolio) {
      redirect("/portfolio/create");
    }
  }

  // Convert Mongoose doc to plain object
  const portfolioData = portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {mode === "edit" ? "Edit Portfolio" : "Create Portfolio"}
        </h1>
        <PortfolioForm initialData={portfolioData} mode={mode} />
      </div>
    </div>
  );
}