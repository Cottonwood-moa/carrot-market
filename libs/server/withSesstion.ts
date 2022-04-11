import { withIronSessionApiRoute } from "iron-session/next";
// withIronSessionApiRoute으로 감싸는 요청은
// session을 사용해야 하는 요청
// enter는 로그인 하기 전이니 감싸주지 않는다.
declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: "carrotsession",
  password:
    "fhwioqhgfiorqhoiior26h1t56e4h8bt91b56e4b8tw1b9t48werb1t5er4b85tr1eb1t",
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
