
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Loader } from '../ui/loader';
import { LogIn } from 'lucide-react';
import { useLocale } from '@/context/locale-context';
import { loginUser } from '@/actions/auth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { translations } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const result = await loginUser({ email, password });
        
        if (result.error) {
            toast({
                title: translations.loginForm.loginFailedTitle,
                description: result.error, // The server action provides a safe error message
                variant: 'destructive',
            });
        } else if (result.user) {
            await login(result.user);
            toast({ title: translations.loginForm.loginSuccess, description: translations.loginForm.welcomeBack });
            const redirectUrl = searchParams.get('redirect') || '/profile';
            router.push(redirectUrl);
        } else {
             toast({ title: translations.loginForm.loginFailedTitle, description: translations.loginForm.loginFailedDesc, variant: 'destructive' });
        }
    } catch (error) {
        console.error("Login failed:", error);
        toast({ title: translations.loginForm.loginFailedTitle, description: translations.loginForm.loginFailedDesc, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center">
            <LogIn className="mr-2 h-8 w-8" /> {translations.loginForm.title}
        </CardTitle>
        <CardDescription>{translations.loginForm.description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{translations.loginForm.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              placeholder={translations.loginForm.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{translations.loginForm.passwordLabel}</Label>
            <Input
              id="password"
              type="password"
              placeholder={translations.loginForm.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader size={20} className="mr-2" /> : <LogIn className="mr-2 h-5 w-5" />}
            {isLoading ? translations.loginForm.loggingIn : translations.loginForm.loginButton}
          </Button>
          <p className="text-sm text-muted-foreground">
            {translations.loginForm.noAccount}{' '}
            <Button variant="link" asChild className="p-0 h-auto text-primary">
              <Link href="/register">{translations.loginForm.registerHere}</Link>
            </Button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
