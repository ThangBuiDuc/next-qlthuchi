"use client";

// import Select from "react-select";
import { listContext } from "../content";
import { useContext, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@nextui-org/spinner";
import { updateYearUpgrade, upgradeAPI } from "@/utils/funtionApi";
import moment from "moment";
import { toast } from "react-toastify";
import { useSubscription, gql } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
// import LeftPanel from "./leftPanel";
// import RightPanel from "./rightPanel";

const School = () => {
  const { permission, upgrade } = useContext(listContext);
  // const [selected, setSelected] = useState();
  const [mutating, setMutating] = useState(false);
  const { getToken, userId } = useAuth();
  // console.log(school_year);

  const { data: year_upgrade, loading } = useSubscription(gql`
    subscription year_upgrade {
      result: year_upgrade(
        where: { school_year: { is_active: { _eq: true } } }
      ) {
        id
        is_upgrade_primary
        is_upgrade_secondary
        school_year_id
      }
    }
  `);
  console.log(upgrade);
  const mutation = useMutation({
    mutationFn: () =>
      upgradeAPI({
        type: "SCHOOL",
        old_school_year_id: upgrade.result[0].previous_school_year_id,
        school_year_id: upgrade.result[0].id,
      }),
    onSuccess: async () => {
      await updateYearUpgrade(
        {
          is_upgrade_primary: true,
          is_upgrade_secondary: true,
          updated_at: moment().format(),
          upgraded_by: userId,
        },
        { school_year_id: { _eq: year_upgrade.result[0].school_year_id } },
        await getToken({ template: process.env.NEXT_PUBLIC_TEMPLATE_USER })
      );
      setMutating(false);
      toast.success("Tiến hành lên lớp cho cấp học thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
    onError: () => {
      setMutating(false);
      toast.error("Tiến hành lên lớp cho cấp học không thành công!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    },
  });
  return (
    <>
      {/* <div className="flex gap-1 items-center w-full">
        <h6>Cấp học: </h6>
        <Select
          noOptionsMessage={() => "Không tìm thấy kết quả phù hợp!"}
          placeholder="Vui lòng chọn!"
          options={listSearchSchoolYear.school_level
            .sort((a, b) => a.code - b.code)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          value={selected}
          onChange={(e) => e.value !== selected?.value && setSelected(e)}
          className="text-black w-[30%]"
          classNames={{
            menu: () => "!z-[11]",
          }}
        />
      </div> */}
      {loading ? (
        <Spinner color="primary" />
      ) : year_upgrade.result[0].is_upgrade_primary &&
        year_upgrade.result[0].is_upgrade_secondary ? (
        <h6 className="text-center">
          Không thể thực hiện lên lớp cho học sinh vì đã thực hiện trước đó
          trước đó!
        </h6>
      ) : mutating ? (
        <Spinner />
      ) : permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT ? (
        <div className="flex justify-center">
          <button
            className="btn"
            onClick={() => {
              setMutating(true);
              mutation.mutate();
            }}
          >
            Tiến hành lên lớp
          </button>
        </div>
      ) : (
        <></>
      )}
      {/* {selected && (
        <div className="flex w-full divide-x divide-black h-full">
          {permission === process.env.NEXT_PUBLIC_PERMISSION_READ_EDIT && (
            <LeftPanel selected={selected} />
          )}
          <RightPanel selected={selected} />
        </div>
      )} */}
    </>
  );
};

export default School;
