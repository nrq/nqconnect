
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/settings">
              <ArrowLeft />
              <span className="sr-only">Back to Settings</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold font-headline">Privacy Policy</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Last updated: {new Date().toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. It is NurulQuranConnect's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
            </p>
            <p>
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            </p>
            <p>
              We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
            </p>
            <p>
              We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
            </p>
            <p>
              Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
            </p>
            <p>
              You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
            </p>
             <p>
                Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
