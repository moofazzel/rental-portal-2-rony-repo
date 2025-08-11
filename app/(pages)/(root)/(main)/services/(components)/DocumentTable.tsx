// components/DocumentTable.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentEntry } from "@/types/document.types";
import { DocumentRow } from "./DocumentRow";

export const DocumentTable = () => {
  const documents: DocumentEntry[] = [
    {
      id: "1",
      title: "Design Guidelines",
      description: "A comprehensive design guide for new hires.",
      community: "design",
      fileType: "pdf",
      fileName: "design-guidelines.pdf",
      uploadedAt: "2025-07-01",
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      title: "Marketing Strategy 2025",
      description: "Roadmap for Q3-Q4 marketing initiatives.",
      community: "marketing",
      fileType: "doc",
      fileName: "marketing-strategy.docx",
      uploadedAt: "2025-07-03",
      fileSize: "1.8 MB",
    },
    {
      id: "3",
      title: "Product Design V2",
      description: "Updated mockups for mobile app.",
      community: "design",
      fileType: "img",
      fileName: "mobile-ui-v2.png",
      uploadedAt: "2025-07-02",
      fileSize: "1.2 MB",
    },
    {
      id: "4",
      title: "Eng Docs",
      description: "Initial engineering documentation.",
      community: "engineering",
      fileType: "pdf",
      fileName: "eng-docs.pdf",
      uploadedAt: "2025-06-28",
      fileSize: "3.1 MB",
    },
    {
      id: "5",
      title: "Content Plan",
      description: "Plan for blog and SEO.",
      community: "marketing",
      fileType: "doc",
      fileName: "content-plan.docx",
      uploadedAt: "2025-07-04",
      fileSize: "0.9 MB",
    },
    {
      id: "6",
      title: "Branding Kit",
      description: "Logos and brand assets.",
      community: "design",
      fileType: "img",
      fileName: "branding-kit.jpg",
      uploadedAt: "2025-06-30",
      fileSize: "2.7 MB",
    },
    {
      id: "7",
      title: "Bug Report Template",
      description: "Template for QA bug reports.",
      community: "engineering",
      fileType: "doc",
      fileName: "bug-template.doc",
      uploadedAt: "2025-07-05",
      fileSize: "1.1 MB",
    },
    {
      id: "8",
      title: "Sprint Demo Notes",
      description: "Notes from last sprint demo.",
      community: "engineering",
      fileType: "pdf",
      fileName: "sprint-notes.pdf",
      uploadedAt: "2025-07-01",
      fileSize: "2.0 MB",
    },
    {
      id: "9",
      title: "SEO Audit",
      description: "SEO audit of top 10 landing pages.",
      community: "marketing",
      fileType: "pdf",
      fileName: "seo-audit.pdf",
      uploadedAt: "2025-07-06",
      fileSize: "2.2 MB",
    },
    {
      id: "10",
      title: "Final Presentation",
      description: "Slides for client presentation.",
      community: "design",
      fileType: "img",
      fileName: "presentation.png",
      uploadedAt: "2025-07-07",
      fileSize: "1.5 MB",
    },
  ];

  return (
    <div className="overflow-x-auto ">
      <Card className="pb-10 px-6 mt-[15px] mb-8 bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center ">All Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3 text-sm font-medium text-gray-700 ">
                  Document
                </th>
                <th className="p-3 text-sm font-medium text-gray-700 ">
                  Community
                </th>

                <th className="p-3 text-sm font-medium text-gray-700 ">
                  Filename
                </th>
                <th className="p-3 text-sm font-medium text-gray-700 ">
                  Uploaded
                </th>

                <th className="px-4 p-3 text-sm font-medium text-gray-700 ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 4).map((doc, index) => (
                <DocumentRow key={doc.id} doc={doc} index={index} />
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
