import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

const UploadFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    // Connect this to backend later
    console.log("Uploading file:", selectedFile);
  };

  return (
    <Card className="w-full max-w-xl border border-gray-200 bg-white text-gray-900 shadow-md">
      <CardContent className="flex flex-col items-center gap-6 p-6">
        <div className="flex flex-col items-center gap-2">
          <UploadCloud className="h-10 w-10 text-gray-500" />
          <p className="text-sm text-gray-500">
            Select a PDF or DOCX file to upload
          </p>
        </div>

        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="cursor-pointer file:text-gray-600"
        />

        {selectedFile && (
          <p className="text-sm text-green-600">{selectedFile.name}</p>
        )}

        <Button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full"
        >
          Upload
        </Button>
      </CardContent>
    </Card>
  );
};

export default UploadFile;
