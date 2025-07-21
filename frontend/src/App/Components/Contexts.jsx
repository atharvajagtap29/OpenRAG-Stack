import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DeleteContextAPI, GetAllContextsAPI } from "../API/Context";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";

import ChatBoxModal from "./ChatBox";

const Contexts = () => {
  const [contexts, setContexts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(false);

  // Chat modal state
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedContext, setSelectedContext] = useState(null);

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const isAllSelected =
    contexts.length > 0 && selectedIds.length === contexts.length;

  const fetchContexts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await GetAllContextsAPI({ page });
      if (res.success) {
        setContexts(res.data || []);
        setPagination(res.pagination);
      } else {
        toast.error(res.message || "Failed to fetch contexts.");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  // Chat modal handlers
  const openChatModal = (ctx) => {
    setSelectedContext(ctx);
    setShowChatModal(true);
  };

  const closeChatModal = () => {
    setSelectedContext(null);
    setShowChatModal(false);
  };

  // Handle row selection
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contexts.map((ctx) => ctx.context_id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Delete selected contexts
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      const res = await DeleteContextAPI({ context_ids: selectedIds });
      if (res.success) {
        toast.success("Selected contexts deleted.");
        setSelectedIds([]);
        fetchContexts(pagination.current_page); // refresh table
      } else {
        toast.error(res.message || "Failed to delete.");
      }
    } catch (err) {
      toast.error("Error deleting contexts.");
    }
  };

  const handlePageChange = (direction) => {
    const newPage =
      direction === "prev"
        ? pagination.current_page - 1
        : pagination.current_page + 1;

    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchContexts(newPage);
    }
  };

  return (
    <div className="w-full px-4 mt-6 space-y-6">
      {/* <h2 className="text-2xl font-semibold text-left">Uploaded Contexts</h2> */}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : contexts.length === 0 ? (
        <p className="text-center text-muted-foreground">No contexts found.</p>
      ) : (
        <>
          <div className="w-full overflow-x-auto border rounded-md shadow-sm">
            <div className="w-full max-w-7xl mx-auto px-4">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="px-2 w-[40px] text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="cursor-pointer"
                      />
                    </TableHead>

                    <TableHead className="px-4 text-left w-1/4">Name</TableHead>
                    <TableHead className="px-4 text-left w-1/5">Type</TableHead>
                    <TableHead className="px-4 text-left w-2/5">
                      S3 Key
                    </TableHead>
                    <TableHead className="px-4 text-left w-1/5">
                      Created At
                    </TableHead>
                    <TableHead className="px-4 text-center w-[100px]">
                      Chat
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contexts.map((ctx) => (
                    <TableRow key={ctx.context_id}>
                      <TableCell className="px-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(ctx.context_id)}
                          onChange={() => toggleSelectOne(ctx.context_id)}
                          className="cursor-pointer"
                        />
                      </TableCell>

                      <TableCell className="px-4 text-left">
                        {ctx.context_name}
                      </TableCell>
                      <TableCell className="px-4 text-left">
                        {ctx.context_type}
                      </TableCell>
                      <TableCell className="px-4 text-left text-xs truncate text-muted-foreground">
                        {ctx.s3_key}
                      </TableCell>
                      <TableCell className="px-4 text-left text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(ctx.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 text-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openChatModal(ctx)}
                          className="hover:bg-muted"
                        >
                          <MessageCircle className="w-5 h-5 text-muted-foreground" />
                          <span className="sr-only">
                            Open chat for {ctx.context_name}
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {showChatModal && (
            <ChatBoxModal context={selectedContext} onClose={closeChatModal} />
          )}

          {selectedIds.length > 0 && (
            <div className="flex justify-end px-4 pt-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === 1}
              onClick={() => handlePageChange("prev")}
            >
              Previous
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Page {pagination.current_page} of {pagination.total_pages}
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.current_page === pagination.total_pages}
              onClick={() => handlePageChange("next")}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Contexts;
