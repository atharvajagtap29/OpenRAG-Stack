import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadCloud, Loader2 } from "lucide-react";
import { CreateContextAPI } from "../API/Context";
import { toast } from "sonner";

const UploadFile = () => {
  const [contextName, setContextName] = useState("");
  const [contextType, setContextType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!contextName || !contextType || !selectedFile) {
      toast.error("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("context_name", contextName);
    formData.append("context_type", contextType);
    formData.append("context_file", selectedFile);

    try {
      setUploading(true);

      const res = await CreateContextAPI(formData);

      console.log("Upload response:", JSON.stringify(res, null, 2));

      if (res.success) {
        const name = res.data?.context_name || "Unknown";
        const type = res.data?.context_type || "Unknown";
        toast.success(`Uploaded "${name}" (${type}) successfully`);

        // Reset fields
        setContextName("");
        setContextType("");
        setSelectedFile(null);
      } else {
        toast.error(res.message || "Upload failed. Try again.");
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error?.response?.data?.message || "Upload failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto border bg-white shadow-sm rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-medium text-gray-800">Upload Context</h2>
          <p className="text-sm text-muted-foreground">
            Upload a .pdf, .docx, or .txt file with a context name & type
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="contextName">Name</Label>
            <Input
              id="contextName"
              placeholder="e.g., project-report"
              value={contextName}
              onChange={(e) => setContextName(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contextType">Type</Label>
            <Input
              id="contextType"
              placeholder="e.g., report, resume"
              value={contextType}
              onChange={(e) => setContextType(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contextFile">File</Label>
            <Input
              id="contextFile"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {selectedFile && (
              <p className="text-sm text-green-600 truncate">
                {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploading || !contextName || !contextType || !selectedFile}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Context"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default UploadFile;
