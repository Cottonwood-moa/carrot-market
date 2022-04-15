interface Props {
  kind: "product" | "card";
}

export default function Skeleton({ kind }: Props) {
  if (kind === "card") {
    return (
      <>
        <div className="flex w-full  items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-slate-200" />
          <div className="w-[80%] space-y-2">
            <div className="h-3 w-20 bg-slate-200"></div>
            <div className="h-3 w-48 bg-slate-200"></div>
            <div className="h-3 w-[80%] flex-grow bg-slate-200"></div>
          </div>
        </div>
      </>
    );
  }
  if (kind === "product") {
    return (
      <>
        <div className="flex w-full  items-center space-x-4">
          <div className="h-24 w-24 rounded-md bg-slate-200" />
          <div className="w-[80%] space-y-2">
            <div className="h-3 w-20 bg-slate-200"></div>
            <div className="h-3 w-48 bg-slate-200"></div>
            <div className="h-3 w-[80%] flex-grow bg-slate-200"></div>
          </div>
        </div>
      </>
    );
  } else return <></>;
}
