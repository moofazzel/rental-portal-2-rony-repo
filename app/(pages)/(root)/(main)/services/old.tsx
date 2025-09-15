"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Search,
  Shield,
  User,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const services = [
  {
    name: "Water",
    description: "Leaky faucets, clogged drains, and other plumbing issues.",
    icon: "🚿",
    color: "green",
    priority: "high",
  },
  {
    name: "Electrical",
    description: "Power outages, faulty outlets, or lighting problems.",
    icon: "⚡",
    color: "blue",
    priority: "high",
  },
  {
    name: "HVAC",
    description: "Heating, ventilation, and air conditioning issues.",
    icon: "❄️",
    color: "cyan",
    priority: "medium",
  },
  {
    name: "Pest Control",
    description: "Report insects, rodents, or other pests.",
    icon: "🐛",
    color: "orange",
    priority: "medium",
  },
  {
    name: "General Maintenance",
    description: "General repairs and maintenance requests.",
    icon: "🔧",
    color: "purple",
    priority: "low",
  },
  {
    name: "Other",
    description: "Any other maintenance or service request.",
    icon: "📝",
    color: "gray",
    priority: "low",
  },
];

type ServiceRequest = {
  id: string;
  type: string;
  title: string;
  report: string;
  file: File | null;
  site: string;
  urgency: string;
  contact: string;
  pets: boolean;
  permission: boolean;
  status: string;
  statusHistory: { status: string; timestamp: string }[];
  submittedAt: string;
  sla: string;
};

export default function Services() {
  const [type, setType] = useState(services[0].name);
  const [title, setTitle] = useState("");
  const [report, setReport] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");

  const [site, setSite] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [contact, setContact] = useState("");
  const [pets, setPets] = useState(false);
  const [permission, setPermission] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newRequest: ServiceRequest = {
      id: `SR-${Date.now().toString().slice(-6)}`,
      type,
      title,
      report,
      file,
      site,
      urgency,
      contact,
      pets,
      permission,
      status: "Submitted",
      statusHistory: [
        { status: "Submitted", timestamp: new Date().toLocaleString() },
      ],
      submittedAt: new Date().toLocaleString(),
      sla:
        urgency === "high"
          ? "24 hours"
          : urgency === "normal"
          ? "2-3 business days"
          : "1 week",
    };

    setRequests([newRequest, ...requests]);
    setSubmitted(true);
    setActiveTab("history");

    setTimeout(() => {
      setSubmitted(false);
      setType(services[0].name);
      setTitle("");
      setReport("");
      setFile(null);
      setSite("");
      setUrgency("normal");
      setContact("");
      setPets(false);
      setPermission(false);
    }, 2000);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Submitted
          </Badge>
        );
      case "In Progress":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        );
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            High Priority
          </Badge>
        );
      case "normal":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Normal
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Low Priority
          </Badge>
        );
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceIcon = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName);
    return service?.icon || "🔧";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Wrench className="w-12 h-12 text-white" />
            </div>
            {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div> */}
          </div>
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 bg-clip-text text-transparent">
              Service Requests
            </h1>
            <p className="text-slate-600 mt-3 text-lg max-w-2xl mx-auto">
              Submit maintenance requests and track their progress in real-time
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Requests
                  </p>
                  <p className="text-3xl font-bold">{requests.length}</p>
                </div>
                <FileText className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">
                    In Progress
                  </p>
                  <p className="text-3xl font-bold">
                    {requests.filter((r) => r.status === "In Progress").length}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Completed
                  </p>
                  <p className="text-3xl font-bold">
                    {requests.filter((r) => r.status === "Completed").length}
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    This Month
                  </p>
                  <p className="text-3xl font-bold">
                    {
                      requests.filter((r) => {
                        const submittedDate = new Date(r.submittedAt);
                        const now = new Date();
                        return (
                          submittedDate.getMonth() === now.getMonth() &&
                          submittedDate.getFullYear() === now.getFullYear()
                        );
                      }).length
                    }
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
            <div className="flex space-x-4">
              <Button
                variant={activeTab === "history" ? "default" : "ghost"}
                className={`!px-4 py-3 ${
                  activeTab === "history"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Request History
                {requests.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-white/20 text-white"
                  >
                    {requests.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant={activeTab === "form" ? "default" : "ghost"}
                className={`!px-4 py-3 ${
                  activeTab === "form"
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("form")}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Request Submitted Successfully!
                  </h3>
                  <p className="text-green-100">
                    Your service request has been received and is being
                    processed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        {activeTab === "form" ? (
          <div className="container mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  New Service Request
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Request Title */}
                  <div>
                    <Label
                      htmlFor="title"
                      className="text-sm font-semibold text-gray-700 mb-3 block"
                    >
                      Request Title *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Brief description of the issue (e.g., 'Leaky kitchen faucet')"
                      required
                      className="h-12 text-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* Service Type Selection */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-4 block">
                      Service Type *
                    </Label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {services.map((service) => (
                        <Button
                          key={service.name}
                          type="button"
                          variant={
                            type === service.name ? "default" : "outline"
                          }
                          className={`justify-start h-auto p-4 border-2 transition-all ${
                            type === service.name
                              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-orange-500 shadow-lg"
                              : "hover:border-orange-300 hover:bg-orange-50"
                          }`}
                          onClick={() => setType(service.name)}
                        >
                          <span className="text-2xl mr-3">{service.icon}</span>
                          <div className="text-left">
                            <div className="font-semibold">{service.name}</div>
                            <div className="text-xs opacity-80 mt-1">
                              {service.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <Label
                      htmlFor="report"
                      className="text-sm font-semibold text-gray-700 mb-3 block"
                    >
                      Detailed Description *
                    </Label>
                    <Textarea
                      id="report"
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      rows={5}
                      placeholder="Please describe the issue in detail. Include any relevant information such as when the problem started, specific locations, and any previous attempts to fix it..."
                      required
                      className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Urgency Level */}
                  <div>
                    <Label
                      htmlFor="urgency"
                      className="text-sm font-semibold text-gray-700 mb-3 block"
                    >
                      Urgency Level
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          value: "low",
                          label: "Low Priority",
                          desc: "Can wait a week",
                          icon: Clock,
                          color: "gray",
                        },
                        {
                          value: "normal",
                          label: "Normal Priority",
                          desc: "2-3 business days",
                          icon: AlertTriangle,
                          color: "blue",
                        },
                        {
                          value: "high",
                          label: "High Priority",
                          desc: "Urgent (24 hours)",
                          icon: Zap,
                          color: "red",
                        },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={
                            urgency === option.value ? "default" : "outline"
                          }
                          className={`justify-start h-auto !p-4 border-2 transition-all ${
                            urgency === option.value
                              ? `bg-gradient-to-r from-${option.color}-500 to-${option.color}-600 text-white border-${option.color}-500 shadow-lg`
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => setUrgency(option.value)}
                        >
                          <option.icon
                            className={`w-5 h-5 mr-3 ${
                              urgency === option.value
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                          <div className="text-left">
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-xs opacity-80 mt-1">
                              {option.desc}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        checked={pets}
                        onChange={(e) => setPets(e.target.checked)}
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          I have pets in the unit
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          This helps maintenance prepare appropriately
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <input
                        type="checkbox"
                        checked={permission}
                        onChange={(e) => setPermission(e.target.checked)}
                        className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        required
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          I give permission for maintenance to enter my unit
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Required for service completion
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg text-white h-14 text-lg font-semibold"
                    disabled={submitted}
                  >
                    {submitted ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5 mr-3" />
                        Submit Service Request
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Request History */
          <div className="container mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  Request History
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-8">
                {/* Search */}
                <div className="mb-8">
                  <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search requests by title, type, or status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Requests List */}
                <div className="space-y-6">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Wrench className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No service requests yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Submit your first request to get started
                      </p>
                      <Button
                        onClick={() => setActiveTab("form")}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 !px-4"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Request
                      </Button>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <Card
                        key={request.id}
                        className="shadow-md border-0 hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white text-xl">
                                {getServiceIcon(request.type)}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">
                                  {request.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  {request.type}
                                </p>
                                <div className="flex items-center gap-3">
                                  {getStatusBadge(request.status)}
                                  {getUrgencyBadge(request.urgency)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Submitted</p>
                              <p className="font-medium text-gray-900">
                                {request.submittedAt}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                SLA:{" "}
                                <span className="font-medium">
                                  {request.sla}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                ID:{" "}
                                <span className="font-mono font-medium">
                                  {request.id}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                Pets:{" "}
                                <span className="font-medium">
                                  {request.pets ? "Yes" : "No"}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {request.report}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact the office at or visit the{" "}
              <Link
                href="/support"
                className="text-purple-600 hover:text-purple-700 font-medium underline"
              >
                Support page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
