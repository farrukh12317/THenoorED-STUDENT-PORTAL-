"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
// import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export function LoginForm(){
   const [name, setName] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

 const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }), // Sending name instead of email
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // 1. Save the returned ID in localStorage
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userName', data.user.name);

      // 2. Redirect to dashboard
      router.push('/dashboard');

    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong.');
    }
  };
  return (
  
  <div className={cn("flex flex-col gap-6", "text-green-500")}>

     <div className="flex justify-center">
      <Image
        src="/header.png"
        alt="Header"
        width={400}
        height={120}
        priority
        className="h-auto w-full max-w-sm object-contain"
      />
    </div>
    <Card className="text-green-500">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your name below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <FieldGroup>
            <Field>
              <Input
                id="name"
                type="text"
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  className="pr-10"
                  onChange={(e) => setpassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md text-green-500 hover:bg-green-500/10 active:scale-75 transition-transform duration-150"
                >
                  <Eye
                    className={cn(
                      "absolute h-4 w-4 transition-all duration-300",
                      showPassword
                        ? "opacity-0 rotate-90 scale-0"
                        : "opacity-100 rotate-0 scale-100"
                    )}
                  />
                  <EyeOff
                    className={cn(
                      "absolute h-4 w-4 transition-all duration-300",
                      showPassword
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-0"
                    )}
                  />
                </button>
              </div>
            </Field>

            <Field>
              <Button type="submit">Login</Button>

              <FieldDescription className="text-center text-green-500">
                If you don&apos;t have an account, please visit the center
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
);
}
