import { useLoading } from "@/context/LoadingContext";
import { DayOfWeek, ScheduleItem } from "@/types/counsellors";
import { updateSchedule } from "@/utils/counsellor";
import { toast } from "react-toastify";

export default function Schedule({
  schedule,
  updateScheduleItem,
  mode,
  id,
}: {
  schedule: ScheduleItem[];
  updateScheduleItem: (day: DayOfWeek, updates: Partial<ScheduleItem>) => void;
  mode: string;
  id?: string;
}) {
  const { setLoading } = useLoading();
  const UpdateSchedule = async () => {
    setLoading(true);

    if (!id) {
      toast.error("Counsellor ID not provided");
      setLoading(false);
      return;
    }
    const workingDays = schedule.filter((day) => day.isWorkingDay);
    if (
      workingDays.length < 3 ||
      workingDays.some(
        (day) => !day.startTime || !day.endTime || day.startTime >= day.endTime
      )
    ) {
      toast.error(
        "At least 3 working days must be selected with valid start and end times."
      );
      setLoading(false);
      return;
    }
    const res = await updateSchedule(id, schedule);
    if (res) {
      toast.success("Schedule updated successfully");
    } else {
      toast.error("Failed to update schedule");
    }
    setLoading(false);
  };
  return (
    <div className="mx-auto p-6 bg-white rounded-lg">
      {/* Schedule List */}
      <div className="space-y-4 mt-4">
        {schedule.map((item) => (
          <div key={item.day} className="bg-gray-100 p-4 rounded-lg shadow-sm">
            {/* Day Name */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                {item.day}
              </h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.isWorkingDay}
                  onChange={(e) =>
                    updateScheduleItem(item.day, {
                      isWorkingDay: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">Working Day</span>
              </label>
            </div>

            {/* Start & End Time Inputs */}
            {item.isWorkingDay && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={item.startTime || ""}
                    onChange={(e) =>
                      updateScheduleItem(item.day, {
                        startTime: e.target.value,
                      })
                    }
                    className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={item.endTime || ""}
                    onChange={(e) =>
                      updateScheduleItem(item.day, { endTime: e.target.value })
                    }
                    className="block w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {mode === "edit" && id && (
        <button
          onClick={UpdateSchedule}
          className="mt-4 px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-secondary  w-full disabled:opacity-50"
        >
          Update
        </button>
      )}
    </div>
  );
}
