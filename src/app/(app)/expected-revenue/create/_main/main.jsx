import Class from "./class";
import ClassLevel from "./classLevel";
import School from "./school";
import Student from "./student";

const Main = ({ firstSelected }) => {
  if (!firstSelected)
    return <h6 className="self-center">Vui lòng chọn loại dự kiến thu!</h6>;
  if (firstSelected.value === 0) return <School />;
  if (firstSelected.value === 1) return <ClassLevel />;
  if (firstSelected.value === 2) return <Class />;
  if (firstSelected.value === 3) return <Student />;
};

export default Main;
