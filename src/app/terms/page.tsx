
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold font-headline">Terms & Conditions</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Last updated: {new Date().toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Welcome to NurulQuranConnect!</p>
            <p>These terms and conditions outline the rules and regulations for the use of NurulQuranConnect's Website, located at nqc.app.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use NurulQuranConnect if you do not agree to take all of the terms and conditions stated on this page.</p>
            <h2 className="text-xl font-bold">License</h2>
            <p>Unless otherwise stated, NurulQuranConnect and/or its licensors own the intellectual property rights for all material on NurulQuranConnect. All intellectual property rights are reserved. You may access this from NurulQuranConnect for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <p>You must not:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Republish material from NurulQuranConnect</li>
                <li>Sell, rent or sub-license material from NurulQuranConnect</li>
                <li>Reproduce, duplicate or copy material from NurulQuranConnect</li>
                <li>Redistribute content from NurulQuranConnect</li>
            </ul>
            <h2 className="text-xl font-bold">User Comments</h2>
            <p>This Agreement shall begin on the date hereof.</p>
            <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. NurulQuranConnect does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of NurulQuranConnect, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.</p>
            <h2 className="text-xl font-bold">Disclaimer</h2>
            <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>limit or exclude our or your liability for death or personal injury;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
            </ul>
            <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
