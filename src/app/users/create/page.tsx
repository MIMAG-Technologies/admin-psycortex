"use client";

import Loading from "@/components/Loading";
import UserForm from "@/components/Users/UserForm";
import { useLoading } from "@/context/LoadingContext";
import { getUserDetails, UpdateUser } from "@/utils/users";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";

function UserCreatePage() {
  const searchParams = useSearchParams();
  const { setLoading } = useLoading();
  const id = searchParams.get("id");
  const mode = searchParams.get("mode");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });
  const [timeZone, settimeZone] = useState("");

  const EditUser = async () => {
    const res = await UpdateUser({
      id: id || "",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.date_of_birth,
      gender: formData.gender,
      timezone: timeZone,
    });
    if (res) {
      toast.success("User updated successfully!");
    } else {
      toast.error("Failed to update user. Please try again.");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const res = await getUserDetails(id as string);
      if (res && res.personalInfo) {
        setFormData({
          name: res.personalInfo.name,
          email: res.personalInfo.email,
          phone: res.personalInfo.phone,
          date_of_birth: res.personalInfo.dateOfBirth,
          gender: res.personalInfo.gender,
        });
        settimeZone(res.preferences.timezone);
      } else {
        toast.error("Failed to fetch user details. Please try again.");
      }
      setLoading(false);
    };
    if (mode === "edit" && id) {
      fetchUser();
    }
  }, [id, mode]);

  return (
    <UserForm
      formData={formData}
      setFormData={setFormData}
      mode={mode || "create"}
      EditUser={EditUser}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading/>}>
      <UserCreatePage />
    </Suspense>
  );
}
