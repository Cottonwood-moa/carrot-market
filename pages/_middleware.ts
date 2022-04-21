import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Plz don't be a BOT. Be human", { status: 403 });
  }
  // carrotsession이 없으면 /enter로 redirects
  // api 요청에도 middleware가 실행된다.
  // 로그인 form을 제출하려고 하면 또다시 redirect 되기 때문에
  // url에 api가 있으면 redirect 하지 않는 로직 추가.
  // api 요청에 실행되야 하는 middleware가 있다면
  // api 폴더에 _middleware를 만들어주도록 하자.
  if (!req.url.includes("/api")) {
    if (!req.url.includes("/enter") && !req.cookies.carrotsession) {
      return NextResponse.redirect(`${req.nextUrl.origin}/enter`);
    }
  }
  // 이용자의 위치도 알 수 있다.
  // local host에서는 작동되지 않음.
  // console.log(req.geo?.city)

  // json을 return할 수도 있다.
  // api middleware를 사용할때 유용할 것 같다.
  // return NextResponse.json({ ok: true });
}
