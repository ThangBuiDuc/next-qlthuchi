"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { useState } from "react";
import { Input } from "@nextui-org/input";
import { useMutation } from "@tanstack/react-query";
import { updateConfig } from "@/utils/funtionApi";
import { useAuth, useUser } from "@clerk/nextjs";
import { Spinner } from "@nextui-org/spinner";
import moment from "moment";
import { toast } from "react-toastify";

const Content = ({ permission, config, configID }) => {
  //   console.log(permission, config);
  const { getToken } = useAuth();
  const { user } = useUser();
  const [numberComma, setNumberComma] = useState(config.numberComma.value);
  const [page, setPage] = useState(config.page.value);
  const [mutating, setMutating] = useState(false);

  const mutation = useMutation({
    mutationFn: async () =>
      updateConfig(
        {
          config: {
            numberComma: { ...config.numberComma, value: numberComma },
            page: { ...config.page, value: page },
          },
          updated_by: user.id,
          updated_at: moment().format(),
        },
        {
          id: { _eq: configID },
        },
        await getToken({
          template: process.env.NEXT_PUBLIC_TEMPLATE_USER,
        })
      ),
    onSuccess: () => {
      setMutating(false);
      toast.success("Cập nhật thiết lập thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Cập nhật thiết lập không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  return (
    <Accordion>
      <AccordionItem
        key="1"
        aria-label={config.numberComma.key}
        title={config.numberComma.key}
      >
        <div className="flex w-full gap-2 items-center">
          <Input
            className="w-[50%]"
            type="text"
            label="Dấu phẩy số"
            value={numberComma}
            onChange={(e) => setNumberComma(e.target.value)}
          />
          {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT &&
          mutating ? (
            <Spinner />
          ) : (
            <button
              className="btn w-fit"
              onClick={() => {
                setMutating(true);
                mutation.mutate();
              }}
            >
              Lưu
            </button>
          )}
        </div>
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label={config.page.key}
        title={config.page.key}
      >
        <div className="flex w-full gap-2 items-center">
          <Input
            className="w-[50%]"
            type="number"
            label="Số dòng trên trang"
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
          {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT &&
          mutating ? (
            <Spinner />
          ) : (
            <button
              className="btn w-fit"
              onClick={() => {
                setMutating(true);
                mutation.mutate();
              }}
            >
              Lưu
            </button>
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default Content;
