"use client";

import { createStripeAccountAction } from "@/app/actions/stripe-accounts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Plus, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    accountType: z.enum(["STANDARD", "CONNECT"]),
    accountName: z.string().min(1, "Account name is required"),
    stripeAccountId: z.string().optional(),
    stripeSecretKey: z.string().min(1, "Stripe Secret Key is required"),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.accountType === "CONNECT") {
        return data.stripeAccountId && data.stripeAccountId.length > 0;
      }
      return true;
    },
    {
      message: "Stripe Account ID is required for Connect accounts",
      path: ["stripeAccountId"],
    }
  )
  .refine(
    (data) => {
      // Validate account name length
      return data.accountName.length >= 3 && data.accountName.length <= 100;
    },
    {
      message: "Account name must be between 3 and 100 characters",
      path: ["accountName"],
    }
  )
  .refine(
    (data) => {
      // Validate stripe secret key format (supports both regular and restricted keys)
      if (data.stripeSecretKey) {
        const secretKeyRegex = /^(sk|rk)_(test|live)_[a-zA-Z0-9]{24,}$/;
        return secretKeyRegex.test(data.stripeSecretKey);
      }
      return true;
    },
    {
      message:
        "Please enter a valid Stripe secret key (starts with sk_test_, sk_live_, rk_test_, or rk_live_)",
      path: ["stripeSecretKey"],
    }
  )
  .refine(
    (data) => {
      // Validate stripe account ID format for CONNECT accounts
      if (data.accountType === "CONNECT" && data.stripeAccountId) {
        const accountIdRegex = /^acct_[a-zA-Z0-9]{14,}$/;
        return accountIdRegex.test(data.stripeAccountId);
      }
      return true;
    },
    {
      message: "Please enter a valid Stripe Account ID (starts with acct_)",
      path: ["stripeAccountId"],
    }
  );

type FormData = z.infer<typeof formSchema>;

export default function AddStripeAccountModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "STANDARD",
      accountName: "",
      stripeAccountId: "",
      stripeSecretKey: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      // Add account using server action
      const result = await createStripeAccountAction({
        name: data.accountName,
        stripeAccountId: data.stripeAccountId || "",
        stripeSecretKey: data.stripeSecretKey,
        accountType: data.accountType,
        description: data.description,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to create account");
        return;
      }

      // Show success toast
      toast.success("Stripe account created successfully!");

      // Reset form
      form.reset();

      setOpen(false);
    } catch (error) {
      console.error("Error creating account:", error);
      // Error is already handled in the context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Select Global Account</Label>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              Add Stripe Account
            </DialogTitle>
            <DialogDescription>
              Create a new Stripe account for global payment processing
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto px-6 space-y-4"
            >
              {/* Account Type Selection */}
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Account Type *
                    </FormLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <div
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          field.value === "STANDARD"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => field.onChange("STANDARD")}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              field.value === "STANDARD"
                                ? "border-purple-500 bg-purple-500"
                                : "border-gray-300"
                            }`}
                          >
                            {field.value === "STANDARD" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Standard</div>
                            <div className="text-xs text-gray-600">
                              Your own account
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          field.value === "CONNECT"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => field.onChange("CONNECT")}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              field.value === "CONNECT"
                                ? "border-purple-500 bg-purple-500"
                                : "border-gray-300"
                            }`}
                          >
                            {field.value === "CONNECT" && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">Connect</div>
                            <div className="text-xs text-gray-600">
                              Platform account
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <FormMessage />

                    {/* Account Type Information */}
                    {field.value === "STANDARD" && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Standard Account</p>
                          <ul className="text-xs space-y-1">
                            <li>• Your own Stripe account with full control</li>
                            <li>• Direct access to all Stripe features</li>
                            <li>• You receive payments directly</li>
                            <li>• Requires your own Stripe account setup</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {field.value === "CONNECT" && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-800">
                          <p className="font-medium mb-1">Connect Account</p>
                          <ul className="text-xs space-y-1">
                            <li>
                              • Platform-managed account for your business
                            </li>
                            <li>• Payments processed through our platform</li>
                            <li>• Simplified setup and management</li>
                            <li>
                              • Requires Stripe Account ID from your dashboard
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Account Information */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Global Payment Account"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("accountType") === "CONNECT" && (
                  <FormField
                    control={form.control}
                    name="stripeAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe Account ID *</FormLabel>
                        <FormControl>
                          <Input placeholder="acct_1234567890" {...field} />
                        </FormControl>
                        <FormDescription>
                          Found in your Stripe Dashboard under Connect →
                          Accounts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="stripeSecretKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stripe Secret Key *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showSecretKey ? "text" : "password"}
                            placeholder="sk_test_... or rk_test_..."
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                          >
                            {showSecretKey ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your Stripe secret key or restricted key for this
                        account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of this account's purpose"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DialogFooter className="bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
              onClick={form.handleSubmit(onSubmit)}
            >
              {loading ? "Adding..." : "Add Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
