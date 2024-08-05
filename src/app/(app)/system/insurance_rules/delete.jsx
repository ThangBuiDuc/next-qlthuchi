"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { deleteInsuaranceRule } from "@/utils/funtionApi";
import "react-toastify/dist/ReactToastify.css";
import { id } from "date-fns/locale";

const DeleteModal = ({ isOpen, onClose, ruleToDelete }) => {
  if (!isOpen) return null;

  console.log(ruleToDelete);
  const { getToken } = useAuth();
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ token, id }) => deleteInsuaranceRule(token, id),
    onSuccess: () => {
      setMutating(false);
      onClose();
      queryClient.invalidateQueries(["get_rules"]);
      toast.success("Vô hiệu hoá luật BHYT thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },

    onError: () => {
      setMutating(false);
      toast.error("Vô hiệu hoá luật BHYT không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleDelete = async () => {
    setMutating(true);
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, id: ruleToDelete?.id });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Xác nhận xoá</h2>
        <p className="mb-4">Bạn có chắc chắn muốn xoá luật này không?</p>
        <div className="flex justify-end gap-4">
          <Button color="danger" onClick={handleDelete}>
            Xoá
          </Button>
          <Button color="default" onClick={onClose}>
            Huỷ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
