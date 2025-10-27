"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  applicationFormSchema,
  type ApplicationFormData,
} from "@/zod/application.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ApplicationModalProps {
  variant?: "default" | "compact" | "full-width";
}

export default function ApplicationModal({
  variant = "default",
}: ApplicationModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      currentAddress: "",
      rvYear: undefined,
      rvLength: undefined,
      rvMake: "",
      rvModel: "",
      rvType: "",
      numOccupants: undefined,
      hasPets: "",
      petDetails: "",
      moveInDate: undefined,
      stayDuration: "",
      additionalNotes: "",
      hearAboutUs: "",
    },
  });

  const handleSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted with data:", data);

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form and close modal after showing success
      setTimeout(() => {
        form.reset();
        setIsSubmitted(false);
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6 sm:px-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-lg">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Application Submitted!
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-md">
              Thank you for applying to Pecan Ridge RV Park. We&apos;ll review
              your application and get back to you within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          size={variant === "compact" ? "default" : "lg"}
          className={cn(
            "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all rounded-2xl",
            variant === "default"
              ? "text-xl px-12 py-8 h-auto font-bold group hover:scale-105"
              : variant === "full-width"
              ? "w-full text-lg py-7 h-auto font-bold"
              : "font-semibold rounded-lg"
          )}
        >
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[97vw] sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
              Apply to Pecan Ridge RV Park
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Fill out the form below to start your application. All fields are
              required. We&apos;ll review your application and contact you
              within 24 hours.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
          <Form {...form}>
            <form
              id="application-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Personal Information */}
              <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 pb-3 border-b-2 border-emerald-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="currentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, City, State, ZIP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* RV Information */}
              <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 pb-3 border-b-2 border-emerald-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  RV Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rvYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RV Year *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2020"
                            min="1960"
                            max={new Date().getFullYear() + 1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rvLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RV Length (feet) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="35"
                            min="15"
                            max="60"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rvMake"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RV Make *</FormLabel>
                        <FormControl>
                          <Input placeholder="Winnebago" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rvModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RV Model *</FormLabel>
                        <FormControl>
                          <Input placeholder="Minnie Winnie" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rvType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RV Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select RV type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="motorhome-a">
                            Class A Motorhome
                          </SelectItem>
                          <SelectItem value="motorhome-b">
                            Class B Motorhome
                          </SelectItem>
                          <SelectItem value="motorhome-c">
                            Class C Motorhome
                          </SelectItem>
                          <SelectItem value="fifth-wheel">
                            Fifth Wheel
                          </SelectItem>
                          <SelectItem value="travel-trailer">
                            Travel Trailer
                          </SelectItem>
                          <SelectItem value="toy-hauler">Toy Hauler</SelectItem>
                          <SelectItem value="tiny-house">Tiny House</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Occupancy & Pets */}
              <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 pb-3 border-b-2 border-emerald-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Occupancy & Pets
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="numOccupants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Occupants *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2"
                            min="1"
                            max="10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasPets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you have pets? *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="petDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Details (if applicable)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Number of pets, types, breeds, ages..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-slate-500">
                        We allow up to 2 pets. They must be safe and quiet.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Stay Details */}
              <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 pb-3 border-b-2 border-emerald-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Stay Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="moveInDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Preferred Move-In Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stayDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Planned Stay Duration *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-3-months">
                              1-3 months
                            </SelectItem>
                            <SelectItem value="3-6-months">
                              3-6 months
                            </SelectItem>
                            <SelectItem value="6-12-months">
                              6-12 months
                            </SelectItem>
                            <SelectItem value="12-plus-months">
                              12+ months (Annual)
                            </SelectItem>
                            <SelectItem value="unsure">Not sure yet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 pb-3 border-b-2 border-emerald-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Additional Information
                </h3>

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes or Questions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us anything else we should know..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hearAboutUs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about us?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="google">Google Search</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="friend">
                            Friend/Family Referral
                          </SelectItem>
                          <SelectItem value="rvpark-reviews">
                            RV Park Review Site
                          </SelectItem>
                          <SelectItem value="driving-by">Drove By</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6 space-y-4 shadow-sm">
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                  Important Notice:
                </h4>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Background Check Required:</strong> All applicants
                      must pass a background check for everyone&apos;s safety.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>RV Condition:</strong> We accept RVs regardless of
                      age, as long as they are in good, clean condition.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Response Time:</strong> We&apos;ll review your
                      application and respond within 24 hours.
                    </span>
                  </li>
                </ul>
              </div>
            </form>
          </Form>
        </div>

        {/* Fixed Footer */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="application-form"
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
