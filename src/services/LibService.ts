import axiosInstance from "./axios";

const checkIn = async (studentId: string) => {
  const { data } = await axiosInstance.post("/lib/check-in", {
    student_id: studentId,
  });

  return data;
};

const checkOut = async (studentId: string) => {
  const { data } = await axiosInstance.put("/lib/check-out", {
    student_id: studentId,
  });

  return data;
};

const LibService = {
  checkIn,
  checkOut,
};

export default LibService;
