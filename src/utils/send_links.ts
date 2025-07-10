import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export type LinksPayload = {
  email: string;
  expiry: string;
  phone: string;
  payload: {
    email: string;
    phone: string;
    status: "new" | "reverify";
    counsellorId: string | null;
    remark: string | null;
  };
};

export type Link = {
  email: string;
  token: string | null;
  error: string | null;
};

export const sendLinks = async (payload: LinksPayload[]) => {
  try {
    const res = await axios.post(`${base_url}/send/send_link.php`, payload);
    return res.data as Link[];
  } catch (error) {
    console.log(error);
    return [];
  }
};
