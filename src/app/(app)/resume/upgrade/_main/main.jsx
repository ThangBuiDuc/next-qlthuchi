// import Class from "./class/class";
// import ClassLevel from "./classLevel/classLevel";
import School from "./school";

const Main = ({ firstSelected }) => {
  if (!firstSelected)
    return <h6 className="self-center">Vui lòng chọn hình thức!</h6>;
  if (firstSelected.value === 0) return <School />;
  //   if (firstSelected.value === 1) return <ClassLevel />;
  //   if (firstSelected.value === 2) return <Class />;
};

export default Main;
