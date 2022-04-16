# 🥕 Market application

## 📖 Docs

- [Next.js](https://nextjs.org/docs)
- [Typescript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [SWR](https://swr.vercel.app/ko)
- [Prisma](https://www.prisma.io/)
- [Planet Scale](https://planetscale.com/)
- [IronsSession](https://github.com/vvo/iron-session)
- [CloudFlare](https://www.cloudflare.com/ko-kr/)
- [Twilio](https://www.twilio.com/)
- [SendGrid](https://sendgrid.com/)

## 🎯 Goals

- Next.js + Typescript Severless application
- Next RestAPI 구축.
- SWR data fetching
- SWR Infinite Loading.
- ORM - Prisma
- Serverless DB - Planet Scale
- Iron Session 유저 세션관리.
- twilio + Sendgrid Token 전송.
- CloudFlare images 저장 및 최적화.
- tailwind css로 application UI 생산성 상향.
- Skeleton UI
- Lazy loading

## 💡 Specs

- Next.js
- Typescript
- Tailwind css
- SWR
- twilio
- Prisma
- Planet Scale
- Iron Session
- React Hook Form

## DB ERD  
![Sample DBD for Airbnb (1)](https://user-images.githubusercontent.com/79053495/163667745-aacb476b-10e6-454d-9a99-84eba62ebe42.png)  

## Enter

![enter](https://user-images.githubusercontent.com/79053495/163665461-b241f1f8-2385-46e5-bfee-aef997594567.png)

## Confirm

![confirm](https://user-images.githubusercontent.com/79053495/163665460-17552dfd-6b3a-4ab1-8baf-79f81eed8071.png)

## Product

![productList](https://user-images.githubusercontent.com/79053495/163665467-8548b5e8-458a-4615-9c07-fb17ee060922.png)

## Product Upload Form + Image Preview

![20220416162737](https://user-images.githubusercontent.com/79053495/163666133-6998d9c0-f619-4c2c-83c6-cc31f6a07716.png)  
![20220416162840](https://user-images.githubusercontent.com/79053495/163666145-ed0f74aa-381f-48f4-8d4c-1f2dc915d0cf.png)

## Related

![related](https://user-images.githubusercontent.com/79053495/163665471-0f1f50e0-3b30-4248-9036-fcab8185a088.png)

## ProductDetail

![productDetail](https://user-images.githubusercontent.com/79053495/163665465-339ce2d8-e848-4193-927d-a3d4c8526c11.png)

## Community

![community](https://user-images.githubusercontent.com/79053495/163665458-c0d34405-4b14-43cd-ae93-372ef2bf2846.png)

## CommunityDetail

![communityDetail](https://user-images.githubusercontent.com/79053495/163665459-47f5336d-2833-4745-9e6d-4c874a7c7e7f.png)

## Profile

![profile](https://user-images.githubusercontent.com/79053495/163665469-39552b6e-98e2-4b02-a98d-cb3697f1ac0d.png)

## Favorite

![fav](https://user-images.githubusercontent.com/79053495/163665463-fd79dd4a-b306-464d-8274-7830a0e77dfa.png)

## Skeleton

![productSkeleton](https://user-images.githubusercontent.com/79053495/163665468-7e845044-1614-4e0b-b8f2-80b9ab92cc43.png)  
![profileSkeleton](https://user-images.githubusercontent.com/79053495/163665470-9453a11d-2951-4c22-af81-cc0fe16324e3.png)

## Live Chat

![ezgif com-gif-maker (6)](https://user-images.githubusercontent.com/79053495/163665955-3074face-4be4-4baa-9250-542403b2e965.gif)

## Infinite Loading

![ezgif com-gif-maker (4)](https://user-images.githubusercontent.com/79053495/163665884-bce50afe-8db8-4982-99d7-d6a0f93c1669.gif)

### 구성

```json{
  "name": "carrot-market",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^3.11.1",
    "@sendgrid/mail": "^7.6.2",
    "@tailwindcss/forms": "^0.5.0",
    "iron-session": "^6.1.2",
    "next": "12.1.4",
    "react": "18.0.0",
    "react-dom": "18.0.0",
    "react-hook-form": "^7.29.0",
    "swr": "^1.2.2",
    "ts-node": "^10.7.0",
    "twilio": "^3.76.0"
  },
  "devDependencies": {
    "@types/node": "17.0.23",
    "@types/react": "17.0.43",
    "@types/react-dom": "17.0.14",
    "autoprefixer": "^10.4.4",
    "eslint": "8.12.0",
    "eslint-config-next": "12.1.4",
    "postcss": "^8.4.12",
    "prettier": "^2.6.1",
    "prettier-plugin-prisma": "^3.12.0",
    "prettier-plugin-tailwindcss": "^0.1.8",
    "prisma": "^3.11.1",
    "tailwindcss": "^3.0.23",
    "typescript": "4.6.3"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}

```
