"use client"
import React from "react";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { deleteInsuaranceRule } from "@/utils/funtionApi";
import "react-toastify/dist/ReactToastify.css";

const DeleteModal = ({ isOpen, onClose, ruleToDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Xác nhận xoá</h2>
        <p className="mb-4">Bạn có chắc chắn muốn xoá luật này không?</p>
        <div className="flex justify-end gap-4">
          <Button color="default" onClick={onClose}>Huỷ</Button>
          {/* <Button color="danger" onClick={handleDelete}>Xoá</Button> */}
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
