import Image from "next/image";

const TopSidebar = () => {
  return (
    <div className="hidden lg:flex h-[76px] w-56 flex-col fixed inset-y-0 z-50 border border-red-600">
      <div className="logo">
        <Image src="/logo.png" alt="logo" width={25} height={25} />
        <h1 className="text-white text-2xl font-bold">E-Office</h1>
      </div>
    </div>
  );
};

export default TopSidebar;
