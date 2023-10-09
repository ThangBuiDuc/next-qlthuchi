import Header from "@/app/hardComponents/header";
import Sidebar from "@/app/hardComponents/sidebar";



export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
