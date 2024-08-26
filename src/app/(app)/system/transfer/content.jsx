"use client";
import { useMutation } from "@tanstack/react-query";
import { handleTransfer, updateCountReminder } from "@/utils/funtionApi";
import moment from "moment";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSubscription, gql } from "@apollo/client";
import { Spinner } from "@nextui-org/spinner";

const Content = ({ transfer, permission }) => {
  const { getToken, userId } = useAuth();
  const { result } = transfer;
  const { data: countReminder, loading } = useSubscription(gql`
    subscription count_reminder {
      result: count_reminder(where: { batch: { is_active: { _eq: true } } }) {
        batch_id
        content
        id
      }
    }
  `);

  console.log(result);
  // console.log(countReminder);
  const [mutating, setMutating] = useState(false);

  const mutation = useMutation({
    mutationFn: async () =>
      handleTransfer({
        time: moment().format(),
        id: result[0].id,
        previous_batch_id: result[0].previous_batch_id,
      }),
    onSuccess: async () => {
      await updateCountReminder(
        countReminder.result[0].batch_id,
        {
          batch_id: countReminder.result[0].batch_id,
          content: {
            ...countReminder.result[0].content,
            transfer: {
              time: moment().format(),
              action_by: userId,
              is_transfer: true,
            },
          },
        },
        await getToken({ template: process.env.NEXT_PUBLIC_TEMPLATE_USER })
      );
      setMutating(false);
      toast.success("Kết chuyển công nợ thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Kết chuyển công nợ không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });

  if (result.length === 0) {
    return (
      <div className="flex gap-1 items-center w-full justify-center p-10">
        <h5>
          Hệ thống chưa khởi tạo năm học, vui lòng tạo năm học mới để thực hiện
          các chức năng!
        </h5>
      </div>
    );
  }

  if (!result[0].previous_batch_id) {
    return (
      <div className="flex gap-1 items-center w-full justify-center p-10">
        <h5>
          Hiện tại chưa có thông tin của học kỳ trước để thực hiện kết chuyển
          công nợ
        </h5>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center p-5 gap-7">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col justify-center items-center">
          <h5>Học kỳ trước</h5>
          <h6>
            Học kỳ {result[0].previous_batch} - Năm học{" "}
            {result[0].previous_school_year}
          </h6>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h5>Học kỳ hiện tại</h5>
          <h6>
            Học kỳ {result[0].batch} - Năm học {result[0].school_year}
          </h6>
        </div>
      </div>
      {loading ? (
        <Spinner color="primary" />
      ) : countReminder?.result[0].content.transfer.is_transfer ? (
        <h6 className="text-center">
          Không thể thực hiện kết chuyển công nợ vì đã kết chuyển công nợ trước
          đó!
        </h6>
      ) : permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        mutating ? (
          <span className="loading loading-spinner loading-sm bg-primary self-center"></span>
        ) : (
          <button
            className="btn w-fit self-center"
            onClick={() => {
              setMutating(true);
              mutation.mutate();
            }}
          >
            Kết chuyển
          </button>
        )
      ) : (
        <></>
      )}

      {/* <ExpectedRevenue previous_batch_id={result[0].previous_batch_id} /> */}
    </div>
  );
};

export default Content;
