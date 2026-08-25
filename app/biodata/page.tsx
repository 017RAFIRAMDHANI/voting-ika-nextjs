import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import BiodataForm from "@/components/BiodataForm";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function BiodataPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.voterId) redirect("/pemilihan");

  return (
    <AppShell user={user}>
      <div className="container-xxl flex-grow-1 container-p-y mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0">
              <div className="card-header text-center bg-primary">
                <h3 className="text-white mb-0">Input Biodata</h3>
              </div>
              <div className="card-body">
                <BiodataForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
