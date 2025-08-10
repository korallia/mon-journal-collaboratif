// src/middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/src/app/auth/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};