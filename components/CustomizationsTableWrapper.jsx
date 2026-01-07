"use client";

import { useState } from "react";
import DeleteConfirmModal from "@/components/system/DeleteConfirmModal";
import CustomizationsTable from "./CustomizationsTable";

export default function CustomizationsTableWrapper({ customizations }) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  function closeModal() {
    setDeleteTarget(null);
  }

  return (
    <>
      <CustomizationsTable
        customizations={customizations}
        onDeleteClick={setDeleteTarget}
      />

      {deleteTarget && (
        <DeleteConfirmModal
          type="customization"
          item={deleteTarget}
          onClose={closeModal}
          onDeleteComplete={closeModal}
        />
      )}
    </>
  );
}
