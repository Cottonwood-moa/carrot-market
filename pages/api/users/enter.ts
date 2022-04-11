import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import twilio from "twilio";
import mail from "@sendgrid/mail";
const twiloClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
mail.setApiKey(process.env.SENDGRID_API_KEY!);
// https://nomadcoders.co/carrot-market/lectures/3524 client upsert 작성 과정
// next.js에서 api router를 만들때는 항상 function을 export 해줘야 한다.

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  // 이런 구조의 로직을 잘 기억하자.
  // if else를 남발하고 있다면 이런식으로 코드를 작성해보자.
  // https://nomadcoders.co/carrot-market/lectures/3520 토큰 발급 과정
  const userPayload = phone ? { phone } : email ? { email } : null;
  if (!userPayload) return res.status(400).json({ ok: false });
  const tokenPayload = Math.floor(100000 + Math.random() * 900000) + "";
  const user = await client.user.upsert({
    where: {
      ...userPayload,
    },
    create: {
      name: "Annoymous",
      ...userPayload,
    },
    update: {},
  });
  const token = await client.token.create({
    data: {
      payload: tokenPayload,
      user: {
        connect: {
          // key: token id , value : user.id ??
          id: user.id,
        },
      },
    },
  });
  // connectOrCreate를 사용해서 user upsert와 token create를 합칠 수도 있으나
  // 이게 더 보기가 좋은거 같아서 이렇게 둔다.
  // 위 링크 11:00 참고

  // twilio send message
  if (phone) {
    // await twiloClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MESSAGING_SERRVICE_SID,
    //   to: process.env.PHONE_NUMBER!,
    //   body: `Your login token is ${tokenPayload}`,
    // });
  } else if (email) {
    // const email = await mail.send({
    //   from: "geon0529@gmail.com",
    //   to: "blog_geon@naver.com",
    //   subject: "Your Carrot-Market Verification E-mail",
    //   text: `Your Token is ${tokenPayload}`,
    //   // html: `<strong> blabla </strong>`
    // });
  }
  return res.json({
    ok: true,
  });
}

// 검증 기능을 하는 함수를 고차함수 형식으로 만들어 준다고 생각하면 될듯 하다.
// withhandler 안에 있는 로직에서 검증이 완료되면 2번째 인자로 준 handler가 호출된다.

export default withHandler({
  method: ["POST"],
  handler,
  isPrivate: false,
});

// 밑의 간단 예제를 보면서 이해하자.
// valid가 여기서 withHandler이고 add 가 handler이다.
// valid는 말그대로 특정 검증, 여기서는 a가 1인지 검증하는 로직만을 수행하고
// 원래 기능을 하는 add를 호출한다.

// function add (a:number,b:number){
//   return a+b
// }
// function valid (a:number, b:number, add:(a:number, b:number) => number | string){
//   if(a===1) return add(a,b)
//   else return "a must be 1"
// }
// console.log(valid(1,2,add))
