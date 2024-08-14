import axios from "axios";

export const createClerkUser = async (userName, email, password) => {
  return await axios({
    url: `${process.env.CLERK_API_END_POINT}/users`,
    method: "post",
    data: {
      email_address: [email],
      // username: userName,
      password: password,
      skip_password_checks: true,
    },
    headers: {
      authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });
};
