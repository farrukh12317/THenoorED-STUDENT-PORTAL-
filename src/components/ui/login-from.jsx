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

export function LoginForm(){
   const [name, setName] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
    <div className={cn("flex flex-col gap-6", 'text-green-500')}>
      <Card className={'text-green-500'} >
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
                  type="name"
                  placeholder="name"
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Input id="password" type="password" placeholder="password"
                onChange={e => setpassword(e.target.value)}
                required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              
                <FieldDescription className="text-center text-green-500">
                 if  Don&apos;t have an account? , please visit the center  
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
