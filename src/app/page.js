import { Button } from "@base-ui/react";
import Image from "next/image";
import "./index.css";
import { LoginForm } from "@/components/ui/login-from";
export default function Home() {
  return (
    <>
      <div className="flex  w-full items-center justify-center  md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
