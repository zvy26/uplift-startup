import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '@/components/ui/phone-input.css';
import { ArrowRight, BookOpen, ArrowLeft, MessageSquare } from 'lucide-react';

// Google icon component
const GoogleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  useLoginOtp,
  useVerifyOtp,
  useGoogleSignIn,
  useDemoLogin,
} from '@/services/authMutations';

// Error type for API responses
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// User data interface
interface UserData {
  id: string;
  phone: string;
  name: string;
  avatar: string | null;
}

// Phone form validation schema
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine(value => {
      // Basic validation for international phone number
      return /^\+[1-9]\d{1,14}$/.test(value);
    }, 'Please enter a valid international phone number'),
});

// OTP form validation schema
const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter the 6-digit code'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

interface LoginPageProps {
  onLoginSuccess?: (userData: UserData) => void;
  redirectTo?: string;
}

export const Login = ({ onLoginSuccess, redirectTo = '/ielts-writing' }: LoginPageProps) => {
  const [currentStep, setCurrentStep] = useState<'phone' | 'otp'>('phone');
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [otpFormKey, setOtpFormKey] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mutation hooks
  const loginOtpMutation = useLoginOtp();
  const verifyOtpMutation = useVerifyOtp();
  const googleSignInMutation = useGoogleSignIn();
  const demoLoginMutation = useDemoLogin();

  // Loading states
  const isLoading =
    loginOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    googleSignInMutation.isPending ||
    demoLoginMutation.isPending;

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Reset OTP form when moving to OTP step
  React.useEffect(() => {
    if (currentStep === 'otp') {
      otpForm.reset({ otp: '' });
    }
  }, [currentStep, otpForm]);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    loginOtpMutation.mutate(
      { phone: data.phoneNumber },
      {
        onSuccess: response => {
          setPhoneData(data);
          setCurrentStep('otp');
          setCountdown(60); // 60 seconds countdown
          setOtpFormKey(prev => prev + 1); // Force OTP form re-render

          // Clear any existing OTP value
          otpForm.reset({ otp: '' });

          toast({
            title: 'OTP Sent',
            description: `We've sent a 6-digit code to ${data.phoneNumber}`,
            variant: 'default',
          });
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          toast({
            title: 'Failed to Send OTP',
            description:
              apiError?.response?.data?.message ||
              'Please check your phone number and try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleOtpSubmit = async (data: OtpFormData) => {
    if (!phoneData) return;

    verifyOtpMutation.mutate(
      { phone: phoneData.phoneNumber, otp: data.otp },
      {
        onSuccess: response => {
          toast({
            title: 'Login Successful',
            description: 'Welcome back! You have been successfully logged in.',
            variant: 'default',
          });
          // Reload the page to ensure auth context is properly initialized
          window.location.href = redirectTo;
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          toast({
            title: 'Invalid OTP',
            description:
              apiError?.response?.data?.message ||
              'The code you entered is incorrect. Please try again.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || !phoneData) return;

    loginOtpMutation.mutate(
      { phone: phoneData.phoneNumber },
      {
        onSuccess: () => {
          setCountdown(60);
          toast({
            title: 'OTP Resent',
            description: 'A new code has been sent to your phone.',
            variant: 'default',
          });
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          toast({
            title: 'Failed to Resend OTP',
            description:
              apiError?.response?.data?.message || 'Please try again later.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setPhoneData(null);
    setCountdown(0);
    setOtpFormKey(0);
    otpForm.reset({ otp: '' });
  };

  const handleGoogleSignIn = () => {
    googleSignInMutation.mutate(undefined, {
      onSuccess: response => {
        if (response.data?.user) {
          const userData: UserData = {
            id: response.data.user.id,
            phone: response.data.user.phone,
            name: response.data.user.name,
            avatar: response.data.user.avatar || null,
          };

          toast({
            title: 'Google Sign-in Successful',
            description:
              'Welcome! You have been successfully signed in with Google.',
            variant: 'default',
          });

          onLoginSuccess?.(userData);
          // Reload the page to ensure auth context is properly initialized
          window.location.href = redirectTo;
        }
      },
      onError: (error: unknown) => {
        const apiError = error as ApiError;
        toast({
          title: 'Google Sign-in Failed',
          description:
            apiError?.response?.data?.message ||
            'Unable to sign in with Google. Please try again.',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Uplift AI
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-medium border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              {currentStep === 'phone' ? 'Welcome back' : 'Verify your phone'}
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === 'phone'
                ? 'Enter your phone number to receive a verification code'
                : `We've sent a 6-digit code to ${phoneData?.phoneNumber}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {currentStep === 'phone' ? (
              <Form {...phoneForm}>
                <form
                  onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
                  className="space-y-4"
                >
                  {/* Phone Number Input */}
                  <FormField
                    control={phoneForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <PhoneInput
                              {...field}
                              international
                              defaultCountry="UZ"
                              placeholder="Enter your phone number"
                              disabled={isLoading}
                              className="w-full"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Sending code...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Send verification code</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...otpForm} key={`otp-form-${otpFormKey}`}>
                <form
                  onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
                  className="space-y-4"
                >
                  {/* OTP Input */}
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormControl>
                          <InputOTP
                            value={field.value}
                            onChange={field.onChange}
                            maxLength={6}
                            disabled={isLoading}
                            className="justify-center w-full"
                            autoComplete="one-time-code"
                            placeholder=""
                            autoFocus
                          >
                            <InputOTPGroup className="w-full justify-center">
                              {Array.from({ length: 6 }).map((_, index) => (
                                <InputOTPSlot key={index} index={index} />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resend OTP */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Resend code in {countdown}s
                      </p>
                    ) : (
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-sm"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Resend code
                      </Button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Verify and sign in</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>

                  {/* Back to Phone */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBackToPhone}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to phone number
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>

          
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <Link
              to="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              to="/pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 ACE Uplift AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
