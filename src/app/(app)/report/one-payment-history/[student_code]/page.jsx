import Content from "./content";

const Page = async ({ params }) => {
  return <Content student_code={params.student_code} />;
};

export default Page;
