import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-green-300 to-purple-400">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
