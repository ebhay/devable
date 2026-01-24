import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Navbar } from "@/components/Navbar";
import AllCourses from "@/components/AllCourses";
import Private from "@/components/auth/Private";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession(authOptions);

    if (!session) redirect("/login");

    return (
        <Private>
            <div className="max-h-screen bg-background text-foreground">
                <Navbar />

                <div className="w-[92vw] max-w-7xl mx-auto py-2 my-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Hi {session.user?.name?.split(" ")[0]}, ready for the grind?
                    </h1>
                    <p className="text-muted-foreground mb-8 text-sm">
                        Focus on compounding your skills.
                    </p>

                    <AllCourses />
                </div>
            </div>
        </Private>
    );
}