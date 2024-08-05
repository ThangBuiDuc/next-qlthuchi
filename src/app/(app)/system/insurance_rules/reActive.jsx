"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@nextui-org/button";
import { toast } from "react-toastify";
import { reactivateInsuranceRule } from "@/utils/funtionApi"; // Replace with the actual function for reactivation
import "react-toastify/dist/ReactToastify.css";

const ReActivateModal = ({ isOpen, onClose, ruleToReactivate }) => {
  if (!isOpen) return null;

  const { getToken } = useAuth();
  const [mutating, setMutating] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ token, id }) => reactivateInsuranceRule(token, id),
    onSuccess: () => {
      setMutating(false);
      queryClient.invalidateQueries(["get_rules"]);
      onClose(); // Close the modal on successful reactivation
      toast.success("Khôi phục luật BHYT thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Khôi phục luật BHYT không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  const handleReactivate = async () => {
    setMutating(true);
    const token = await getToken({
      template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
    });
    mutation.mutate({ token, id: ruleToReactivate?.id });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Xác nhận khôi phục</h2>
        <p className="mb-4">Bạn có chắc chắn muốn khôi phục luật này không?</p>
        <div className="flex justify-end gap-4">
          <Button color="primary" onClick={handleReactivate}>
            {mutating ? (
              <span className="loading loading-spinner loading-sm bg-primary"></span>
            ) : (
              "Khôi phục"
            )}
          </Button>
          <Button color="default" onClick={onClose}>
            Huỷ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReActivateModal;
