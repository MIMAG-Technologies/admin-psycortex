import Button from "@/components/Appointments/Button";
import mockAppointments from "@/components/Appointments/MockAppointmentData";
import AppointmentCard from "@/components/Appointments/AppointmentCard";

export default function Page() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-semibold">All Appointments</h1>
        <Button />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mr-4 p-4">
        {mockAppointments.map((appointment, index) => (
          <AppointmentCard key={index} {...appointment} />
        ))}
      </div>
    </div>
  );
}
