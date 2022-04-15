export default function imageDelivery(
  id: string | undefined | null,
  kind: "avatar" | "product" | "productList"
): string {
  if (kind === "avatar") {
    if (!id)
      return `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/c58d9e61-a41e-4bed-d579-fd8bc65f1500/avatar`;
    else return `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${id}/avatar`;
  }
  if (kind === "product") {
    if (!id)
      return `https://media4.giphy.com/media/qGYu56FDMEK6JBZKQN/200w.webp?cid=ecf05e47rh8974gmg9vusvw53pbph036jcm8awsfgfby8i9g&rid=200w.webp&ct=s`;
    else
      return `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${id}/product`;
  }
  if (kind === "productList") {
    if (!id)
      return `https://media4.giphy.com/media/qGYu56FDMEK6JBZKQN/200w.webp?cid=ecf05e47rh8974gmg9vusvw53pbph036jcm8awsfgfby8i9g&rid=200w.webp&ct=s`;
    else
      return `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${id}/productList`;
  } else {
    if (!id)
      return `https://media4.giphy.com/media/qGYu56FDMEK6JBZKQN/200w.webp?cid=ecf05e47rh8974gmg9vusvw53pbph036jcm8awsfgfby8i9g&rid=200w.webp&ct=s`;
    else return `https://imagedelivery.net/eckzMTmKrj-QyR0rrfO7Fw/${id}/public`;
  }
}
