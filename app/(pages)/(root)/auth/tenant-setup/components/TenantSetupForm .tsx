"use client";

import {
  setTenantPasswordAction,
  TenantSetupFormState,
} from "@/app/actions/tenant-setup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route } from "@/constants/RouteConstants";
import { useTenantDataFromUrl } from "@/hooks/useTenantDataFromUrl";
import {
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import TenantSetupSkeleton from "./TenantSetupSkeleton";

const initialState: TenantSetupFormState = {
  success: false,
};

const TenantSetupForm = () => {
  const router = useRouter();
  const { tenantData, loading: tenantLoading, error } = useTenantDataFromUrl();

  const [state, formAction] = useFormState(
    setTenantPasswordAction,
    initialState
  );

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  // Handle form state changes
  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      router.push(Route.LoginPath);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const validateConfirmPassword = (
    confirmPassword: string,
    password: string
  ) => {
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation errors when user starts typing
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));

    // Real-time validation
    if (name === "password") {
      const passwordError = validatePassword(value);
      setValidationErrors((prev) => ({
        ...prev,
        password: passwordError || undefined,
      }));

      // Also validate confirm password if it has a value
      if (formData.confirmPassword) {
        const confirmError = validateConfirmPassword(
          formData.confirmPassword,
          value
        );
        setValidationErrors((prev) => ({
          ...prev,
          confirmPassword: confirmError || undefined,
        }));
      }
    }

    if (name === "confirmPassword") {
      const confirmError = validateConfirmPassword(value, formData.password);
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError || undefined,
      }));
    }
  };

  const isFormValid = () => {
    return (
      formData.password &&
      formData.confirmPassword &&
      !validationErrors.password &&
      !validationErrors.confirmPassword
    );
  };

  if (tenantLoading) return <TenantSetupSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-8">
      <div className="w-full max-w-3xl">
        <form
          action={formAction}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header Section */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="text-center">
              {/* <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <User className="w-6 h-6 sm:w-8 sm:h-8" />
              </div> */}
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                Complete Your Setup
              </h1>
              <p className="text-sm sm:text-base text-blue-100">
                Welcome to your rental portal account
              </p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Welcome,{" "}
                  <span className="text-blue-600 font-semibold">
                    {tenantData?.name}
                  </span>
                  !
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your information has been pre-filled. Please set a secure
                  password to complete your account setup.
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 sm:p-8">
            {/* Hidden fields for form submission */}
            <input type="hidden" name="email" value={tenantData?.email || ""} />
            <input type="hidden" name="tenantId" value={tenantData?.id || ""} />

            <div className="space-y-6 sm:space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="name"
                        value={tenantData?.name || ""}
                        className="h-10 sm:h-11 pl-10 bg-gray-50 border-gray-200 text-gray-600"
                        autoComplete="name"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Pre-filled from your invitation
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        value={tenantData?.email || ""}
                        className="h-10 sm:h-11 pl-10 bg-gray-50 border-gray-200 text-gray-600"
                        autoComplete="email"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Pre-filled from your invitation
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="phoneNumber"
                        type="tel"
                        value={tenantData?.phone || ""}
                        className="h-10 sm:h-11 pl-10 bg-gray-50 border-gray-200 text-gray-600"
                        autoComplete="tel"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Pre-filled from your invitation
                    </p>
                  </div>
                </div>
              </div>

              {/* Property Information Section */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Property Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Property */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Property
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="property"
                        value={tenantData?.property?.name || ""}
                        className="h-10 sm:h-11 pl-10 bg-gray-50 border-gray-200 text-gray-600"
                        autoComplete="off"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Pre-filled from your invitation
                    </p>
                  </div>

                  {/* Spot */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Spot/Lot Number
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="spot"
                        value={tenantData?.spot?.spotNumber || ""}
                        className="h-10 sm:h-11 pl-10 bg-gray-50 border-gray-200 text-gray-600"
                        autoComplete="off"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Pre-filled from your invitation
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Security Setup
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Password */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`h-10 sm:h-11 pl-10 pr-12 ${
                          validationErrors.password
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        autoComplete="new-password"
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {validationErrors.password}
                      </p>
                    )}
                    <div className="mt-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs font-medium text-blue-800 mb-2">
                        Password requirements:
                      </p>
                      <ul className="space-y-1 text-xs text-blue-700">
                        <li className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              formData.password.length >= 8
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          At least 8 characters long
                        </li>
                        <li className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              /(?=.*[a-z])/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          Contains lowercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              /(?=.*[A-Z])/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          Contains uppercase letter
                        </li>
                        <li className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              /(?=.*\d)/.test(formData.password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></span>
                          Contains at least one number
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`h-10 sm:h-11 pl-10 pr-12 ${
                          validationErrors.confirmPassword
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        autoComplete="new-password"
                        placeholder="Confirm your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                    {formData.confirmPassword &&
                      !validationErrors.confirmPassword && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Passwords match
                        </p>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <Button
                type="submit"
                className="w-full h-10 sm:h-11 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid()}
              >
                Complete Setup
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantSetupForm;
