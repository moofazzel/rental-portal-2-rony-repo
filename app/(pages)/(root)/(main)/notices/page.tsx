import { NoticeTable } from "./components/NoticeTable";

const NoticePage = async () => {
  //   const allNotices = await getAllNoticeForTenant();
  //   console.log(allNotices);
  return (
    <div className="flex justify-center items-center py-[120px] px-4">
      <div className="w-full max-w-[90%]">
        <NoticeTable />
      </div>
    </div>
  );
};

export default NoticePage;
