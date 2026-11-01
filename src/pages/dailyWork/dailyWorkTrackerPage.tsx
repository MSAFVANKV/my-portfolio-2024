import DailyWorkTracker from "@/components/daily-work-tracker/DailyWorkTrackerPage";
import WorkEntriesTable from "@/components/daily-work-tracker/WorkEntriesTable";

type Props = {};

function DailyWorkTrackerPage({}: Props) {
  return (
    <div>
      <DailyWorkTracker />

      <WorkEntriesTable />
    </div>
  );
}

export default DailyWorkTrackerPage;
