"use client";

import SubContent from "./subContent";
import { useMemo } from "react";

const Content = ({ student_code, student, present }) => {
  //  const [selected, setSelected] = useState(null);

  const selectPresent = useMemo(
    () => present.result[0].batchs.find((item) => item.is_active === true),
    []
  );

  return (
    <div className="flex flex-col gap-5 justify-center">
      <h5 className="text-center">Tổng hợp công nợ theo một học sinh</h5>
      <div className={`justify-center items-center flex gap-1 `}>
        <h6>
          Học kỳ {selectPresent.batch} - Năm học {present.result[0].school_year}
        </h6>
      </div>
      <SubContent
        present={selectPresent}
        school_year={present}
        student_code={student_code}
        student={student}
      />
    </div>
  );
};

export default Content;
