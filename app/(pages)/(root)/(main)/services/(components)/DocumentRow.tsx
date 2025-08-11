// components/DocumentRow.tsx

import { Button } from "@/components/ui/button";
import { DocumentEntry } from "@/types/document.types";
import { Download } from "lucide-react";

export const DocumentRow = ({
  doc,
  index,
}: {
  doc: DocumentEntry;
  index: number;
}) => {
  // const iconMap = {
  //   img: <Image className="w-5 h-5 text-blue-500" />,
  //   pdf: <FileText className="w-5 h-5 text-red-500" />,
  //   doc: <FileCode2 className="w-5 h-5 text-green-500" />,
  // };

  return (
    <tr
      key={doc.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } hover:bg-blue-50 transition-colors duration-200`}
    >
      <td className="p-3 font-semibold">
        <div className="text-gray-900">{doc.title}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">
          {doc.description}
        </div>
      </td>
      <td className="p-3 capitalize text-sm text-blue-600 font-medium">
        {doc.community}
      </td>
      <td className="p-3 text-sm text-gray-700 truncate max-w-xs">
        {doc.fileName}
      </td>
      <td className="p-3 text-sm text-gray-700">
        {new Date(doc.uploadedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      <td className="p-3">
        <a
          href={`/uploads/${doc.fileName}`}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="sm" variant="outline" className="gap-1">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </a>
      </td>
    </tr>
  );
};
